import { Client } from 'pg'
import getCartItem from './getCartItem'
import getPromotion from './getPromotion'

export default async function ({
    authority_id,
    paymentVerification,
    locale
}: any){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        await client.connect()

        await client.query("begin")
        
        const{rows} = await client.query("SELECT t.cart_items,t.ref_id, t.verified, t.payment_id, t.authority_id, t.provider, t.promotion_slug, t.promotion_discount_price, t.promotion_discount_percentage, t.total_promoted_amount, u.phone_number, u.first_name FROM user_transaction t left join _user u on u.id = t.user_id  WHERE t.authority_id = $1", [
            authority_id
        ])

        if (!rows || !rows[0]) {
            throw 404
        }

        const {cart_items:cartItems, total_promoted_amount} = rows[0]
        
        if (!cartItems) {
            throw 404
        }
        
        if (rows[0].verified) {
            return {
                payment_id: rows[0].payment_id,
                ref_id: rows[0].ref_id,
                total_promoted_amount: rows[0].total_promoted_amount,
                authority_id: rows[0].authority_id,
                provider: rows[0].provider
            }
        }
        
        if (rows[0].promotion_slug){
            const promotion = await getPromotion({
                slug: rows[0].promotion_slug
            })

            if (
                !promotion || 
                (!promotion.discount_price && !promotion.discount_percentage) || 
                !promotion.max_use || 
                Number(promotion.times_used) >= Number(promotion.max_use) ||
                Number(promotion.discount_price) != Number(rows[0].promotion_discount_price) ||
                Number(promotion.discount_percentage) != Number(rows[0].promotion_discount_percentage)
            ) {
                throw new Error("useCases.errors.payment.promotion_expired");
            }

            await client.query("set local app.no_collection = true")

            await client.query("UPDATE promotion SET times_used = times_used + 1 WHERE slug = $1 returning times_used", [
                rows[0].promotion_slug
            ])
        }

        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];

            const retrievedItemFromDataBase = await getCartItem({id: item.selectedModel.id}, locale) as any

            if (
                (retrievedItemFromDataBase.max_amount_purchaseable && Number(retrievedItemFromDataBase.max_amount_purchaseable) < Number(item.quantity)) ||
                (Number(retrievedItemFromDataBase.available_amount) - Number(retrievedItemFromDataBase.frozen_amount_in_warehouse)) < Number(item.quantity)
            ) {

                throw new Error("useCases.errors.payment.invalidCartItem");
            }

            client.query(`
                SET LOCAL
                    app.no_collection = '${true}'
            `)
            await client.query("UPDATE product_model SET available_amount = available_amount - $2, soled_amount = soled_amount + $2 WHERE id = $1", [
                item.selectedModel.id,
                Number(item.quantity)
            ])

        }

        let result : any
        let refId : string | undefined

        if (total_promoted_amount != '0') {
            
            const {ref_id} = await paymentVerification({
                amount: Number(total_promoted_amount),
                authority_id
            })
    
            const {rows} = await client.query("UPDATE user_transaction SET verified = $1, ref_id = $2 WHERE authority_id = $3 RETURNING payment_id, authority_id, provider, ref_id", [
                true,
                ref_id,
                authority_id
            ])
            refId = ref_id
            result = rows
        }else {
            const {rows} = await client.query("UPDATE user_transaction SET verified = $1 WHERE authority_id = $2 RETURNING payment_id, authority_id, provider", [
                true,
                authority_id
            ])
            result = rows
        }


        const {
            sendSms
        } = useFrameworks()

        await sendSms.transactionNotification({
            name: rows[0].first_name,
            phoneNumber: rows[0].phone_number,
            payment_id: rows[0].payment_id,
            ref_id: refId,
            status: "submitted",
        })

        await client.query("commit")
        return {
            ...result[0], 
            firstTime: true, 
            items: cartItems
        }

    } catch (error:any) {
        logger.error(error)
        throw new Error("useCases.errors.general.unExpected");
    }finally {
        await client.end()
    }
}