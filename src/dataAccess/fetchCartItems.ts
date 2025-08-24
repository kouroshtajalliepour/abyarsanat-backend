import { Client } from 'pg'
type ICartItem = {
    id: string,
    quantity: number
}


export default async function fetchCartItems (locale:any, cartItems: ICartItem[]){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        
        
        await client.connect()

        if(!Array.isArray(cartItems) || !cartItems.length) return;

        let selectedProducts = "("

        for (let i = 0; i < cartItems.length; i++) {
            const {id} = cartItems[i];

            selectedProducts += `'${id}'`

            if (i != cartItems.length - 1) {
                selectedProducts += ", "
            }else{
                selectedProducts += ")"
            }

        }

        let {rows} = await client.query(`
            SELECT
                MODEL_L.name as model_name,
                CATEGORY_L.name as category_name,
                MODEL.price_is_dynamic,
                MODEL.id as model_id,
                MODEL.available_amount,
                MODEL.frozen_amount_in_warehouse,
                MODEL.max_amount_purchaseable,
                MODEL.price,
                MODEL.discounted_price,
                MODEL.image_url as model_image_url,
                PRODUCT.id as product_id,
                PRODUCT.weight,
                PRODUCT_L.price_based_on,
                PRODUCT.has_multiple_types,
                PRODUCT.show_models_as_radio,
                PRODUCT_IMAGE.image_url,
                PRODUCT_L.name,
                PRODUCT.slug
            FROM
                product_model MODEL
            LEFT JOIN
                product PRODUCT
            ON
                PRODUCT.id = MODEL.product_id
            LEFT JOIN
                product_image PRODUCT_IMAGE
            ON
                PRODUCT_IMAGE.product_id = PRODUCT.id AND PRODUCT_IMAGE.index_number = 1
            LEFT JOIN
                product_model_localized_info MODEL_L
            ON
                MODEL_L.id = MODEL.id AND MODEL_L.locale = '${locale}' 
            LEFT JOIN
                product_category_localized_info CATEGORY_L
            ON
                CATEGORY_L.id = PRODUCT.product_category_id AND CATEGORY_L.locale = '${locale}' 
            LEFT JOIN
                product_localized_info PRODUCT_L
            ON
                PRODUCT_L.id = PRODUCT.id AND PRODUCT_L.locale = '${locale}' 
            WHERE
                MODEL.id IN ${selectedProducts}
        `);


        return rows

    } catch (error:any) {
        throw new Error("useCases.errors.general.unExpected");
    }finally {
        await client.end()
    }
}