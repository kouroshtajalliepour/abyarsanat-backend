import { Client } from 'pg'

export default async function ({
    id,
    totalWeight,
    shipmentInfo,
    total_payed_amount,
    merchant_id,
    selectedAddress,
    provider,
    authority_id,
    total_amount,
    total_discounted_amount,
    total_promoted_amount,
    promotion_discount_price,
    promotion_discount_percentage,
    promotion_slug,
    cart_items,
    author,
}: any){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        await client.connect()
        

        
        const {
            province_id,
            city_id,
            province_name,
            city_name,
            full_address,
            postal_code,
            coordinates,
            building_number,
            building_unit,
            recipient_phone_number,
            user_phone_number,
            user_first_name,
            recipient_first_name,
            recipient_last_name,
            user_last_name
        } = selectedAddress

        const {
            method: shipment_method, 
            price: payed_shipment_cost,
        }= shipmentInfo
        

        await client.query("INSERT INTO user_transaction (id, merchant_id, provider, authority_id, total_amount, total_discounted_amount, total_promoted_amount, cart_items, user_id, province_name, city_name, province_id, city_id, full_address, postal_code, coordinates, building_number, building_unit, recipient_phone_number, recipient_first_name, recipient_last_name, promotion_discount_price, promotion_discount_percentage, promotion_slug, total_weight, shipment_method, payed_shipment_cost, total_payed_amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)", [
            id,
            merchant_id,
            provider,
            authority_id,
            total_amount,
            total_discounted_amount,
            total_promoted_amount,
            JSON.stringify(cart_items),
            author.id,
            province_name,
            city_name,
            province_id,
            city_id,
            full_address,
            postal_code,
            coordinates,
            building_number,
            building_unit,
            recipient_phone_number ? recipient_phone_number :user_phone_number,
            recipient_first_name ? recipient_first_name :user_first_name,
            recipient_last_name ? recipient_last_name :user_last_name,
            promotion_discount_price,
            promotion_discount_percentage,
            promotion_slug,
            totalWeight,
            shipment_method, 
            payed_shipment_cost,
            total_payed_amount
        ])
    } catch (error:any) {
        logger.error(error)
        throw new Error("useCases.errors.general.unExpected");
    }finally {
        await client.end()
    }
        
}