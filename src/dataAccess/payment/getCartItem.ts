import { Client } from 'pg'

export default async function (cartItem: any,locale:string){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        await client.connect()

        const query = `
            SELECT 
                m.id as model_id,
                ml.name as model_name,
                m.discounted_price,
                m.price,
                m.max_amount_purchaseable,
                m.available_amount,
                m.price_is_dynamic,
                m.frozen_amount_in_warehouse,
                m.image_url as model_image_url,
                p.id,
                p.weight,
                pl.price_based_on,
                p.has_multiple_types,
                p.show_models_as_radio,
                pi.image_url,
                pl.name,
                p.slug
            FROM 
                product_model m
            LEFT JOIN 
                product p 
            ON
                m.product_id = p.id            
            LEFT JOIN 
                product_model_localized_info ml
            ON
                m.id = ml.id and ml.locale = '${locale}'
            LEFT JOIN 
                product_localized_info pl
            ON
                m.product_id = pl.id and pl.locale = '${locale}'
            LEFT JOIN 
                product_image pi 
            ON
                m.product_id = pi.product_id and pi.index_number = 1            
            WHERE m.id = '${cartItem.id}'          
        `
        
        
        const { rows: result } = await client.query(query)

        if (!result || !result[0]) {
            throw {
                status : 404
            }
        }

        return result[0]


    } catch (error:any) {
        switch (error.status) {
            case 404:
                throw new Error("useCases.errors.payment.invalidCartItem");
                break
            default:
                logger.error(error)
                throw new Error("useCases.errors.general.unExpected");
                break;
        }
    }finally {
        await client.end()
    }
}