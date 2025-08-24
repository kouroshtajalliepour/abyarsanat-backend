import { Client } from 'pg'

export default async function getMenu (){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        // todo

        // return [
        //     'lsdkjfd'
        // ]

        await client.connect()

        let {rows:parentCategories} = await client.query(`
            SELECT
                pc.id,
                pc.slug,
                pc.homepage_index,
                max(pm.discounted_price) as max_price,
                pcl.name,
                json_agg(json_build_object('id', c.id, 'slug', c.slug, 'name', cl.name, 'max_price', pml.max_price, 'homepage_index', c.homepage_index)) AS sub_categories
            FROM
                product_category pc
            LEFT JOIN 
                product_category_localized_info pcl ON pcl.id = pc.id and pcl.locale = 'fa'
            LEFT JOIN
                product_category c ON pc.id = c.parent_id
            LEFT JOIN 
                product_category_localized_info cl ON cl.id = c.id and pcl.locale = 'fa'
            LEFT JOIN 
                product_model pm ON pm.product_category_id = pc.id and pm.discounted_price is not null and pm.discounted_price > 0
            LEFT JOIN 
                (
                    SELECT pml.product_category_id, MAX(pml.discounted_price) as max_price
                    FROM product_model pml
                    WHERE pml.discounted_price is not null and pml.discounted_price > 0
                    GROUP BY pml.product_category_id
                ) pml ON pc.id = pml.product_category_id
            WHERE
                pc.homepage_index IS NOT NULL AND pc.homepage_index <> 0 
            GROUP BY
                pc.id, pc.slug, pcl.name,pc.homepage_index
            ORDER BY
                pc.homepage_index ASC;
        `);


        return parentCategories

    } catch (error:any) {
        throw new Error("useCases.errors.general.unExpected");
    }finally {
        await client.end()
    }
}