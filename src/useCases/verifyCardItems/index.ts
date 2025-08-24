import getCartItem from "../../dataAccess/payment/getCartItem"
import createTransaction from "../../dataAccess/payment/carateTransaction"
import getPromotion from '../../dataAccess/payment/getPromotion'
import getAddressAndShipment from '../../dataAccess/payment/getAddressAndShipment'

export default async function ({cartItems, promotion_code, author, config, locale}: {cartItems: any, promotion_code:string, author:any, config: any, locale:string}){
    let amount = 0 
    let discounted_amount = 0 

    const {
        selectedAddress,
        selectedShipment,
    } = config

    const newCart = [...cartItems] as any

    const {
        payment: {
            zarinPal: {
                paymentRequest,
            },
        },
        shipment,
        generateId
    } = useFrameworks()

    const {
        validateULID
    } = useValidators()

    const {
        shipment: {
            validShipments
        }
    } = useRuntimeConfig()

    try {


        validateULID(selectedAddress,)

        if (!validShipments.includes(selectedShipment)) {
            throw new Error("useCases.errors.general.unExpected");
        }
        
        if (!cartItems || !Array.isArray(cartItems) || !cartItems.length) {
            throw new Error("useCases.errors.payment.cartEmpty")
        }

        let totalWeight = 0

        for (let i = 0; i < cartItems.length; i++) {
            const item = cartItems[i];


            const retrievedItemFromDataBase = await getCartItem(item, locale) as any

            totalWeight += Number(retrievedItemFromDataBase.weight) * Number(item.qty);

            newCart[i] = {
                id: retrievedItemFromDataBase.id,
                weight: retrievedItemFromDataBase.weight,
                price_based_on: retrievedItemFromDataBase.price_based_on,
                has_multiple_types: retrievedItemFromDataBase.has_multiple_types,
                image_url: retrievedItemFromDataBase.image_url,
                model_image_url: retrievedItemFromDataBase.model_image_url,
                name: retrievedItemFromDataBase.name, 
                slug: retrievedItemFromDataBase.slug, 
                quantity: newCart[i].qty,
                selectedModel: {
                    name: retrievedItemFromDataBase.model_name,
                    price_is_dynamic: retrievedItemFromDataBase.price_is_dynamic,
                    id: retrievedItemFromDataBase.model_id,
                    available_amount: retrievedItemFromDataBase.available_amount,
                    frozen_amount_in_warehouse: retrievedItemFromDataBase.frozen_amount_in_warehouse,
                    max_amount_purchaseable: retrievedItemFromDataBase.max_amount_purchaseable,
                    price: retrievedItemFromDataBase.price,
                    discounted_price: retrievedItemFromDataBase.discounted_price,
                }
            }


            if (
                (retrievedItemFromDataBase.max_amount_purchaseable && Number(retrievedItemFromDataBase.max_amount_purchaseable) < Number(item.qty)) ||
                (Number(retrievedItemFromDataBase.available_amount) - Number(retrievedItemFromDataBase.frozen_amount_in_warehouse)) < Number(item.qty)
            ) {
                throw new Error("useCases.errors.payment.invalidCartItem");
            }
            

            if (!retrievedItemFromDataBase.price_is_dynamic) {
                discounted_amount += Number(retrievedItemFromDataBase.discounted_price) * Number(item.qty)
                amount += Number(retrievedItemFromDataBase.price) * Number(item.qty)
            }
            
        }

        let paymentConfig : any
        let url: any
        let promotion:any = {}

        let promoted_amount

        if (!promotion_code) {
            promoted_amount = discounted_amount
        }else {
            promotion = await getPromotion({
                slug: promotion_code
            })
            if (
                !promotion || 
                (!promotion.discount_price && !promotion.discount_percentage) || 
                !promotion.max_use || 
                Number(promotion.times_used) >= Number(promotion.max_use) ||
                Number(promotion.max_applicable_price) < Number(discounted_amount) ||
                Number(promotion.min_applicable_price) > Number(discounted_amount)

            ) {
                throw new Error("useCases.errors.payment.promotion_expired");
            }

            promoted_amount = Number(discounted_amount)

            if (promotion.discount_price) {
                promoted_amount -= Number(promotion.discount_price)
            }
            if (promotion.discount_percentage) {
                promoted_amount -= Math.floor(promoted_amount * Number(promotion.discount_percentage) / 100)
            }
        }


        const {
            fetchedAddress,
            shipmentInfo,
            total_payed_amount,
        } = await getAddressAndShipment({
            selectedAddress,
            totalWeight,
            selectedShipment,
            total_promoted_amount: promoted_amount,
            shipmentFunction: shipment
        })

        paymentConfig = await paymentRequest ({
            amount: total_payed_amount,
            user: author
        })

        const id = generateId()

        const {
            merchant_id,
            payment_url,
            authority_id,
        } = paymentConfig

        url = payment_url

        const {
            discount_price: promotion_discount_price,
            discount_percentage: promotion_discount_percentage,
            slug: promotion_slug
        } = promotion

        await createTransaction({
            id,
            selectedAddress: fetchedAddress,
            totalWeight,
            shipmentInfo,
            total_payed_amount,
            merchant_id,
            provider: amount ? "zarin-pal" : "none",
            authority_id,
            total_amount: amount,
            total_discounted_amount: discounted_amount,
            total_promoted_amount: promoted_amount,
            promotion_discount_price,
            promotion_discount_percentage,
            promotion_slug,
            cart_items: newCart,
            author,
        })

        return {
            url,
            newCart
        }

    } catch (error:any) {
        throw error
    }
}