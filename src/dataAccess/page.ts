import { Client } from 'pg'

export default async function getMenu ({id, locale}: {id:string, locale: string} = {locale: '', id: ''}){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        await client.connect()

        const {rows:page} = await client.query(`
            SELECT
                *
            FROM
                page_localized_info
            WHERE
                id = '${id}' AND locale = '${locale}'
        `);

        const {rows:pageBanners} = await client.query(`
            SELECT
                *
            FROM
                page_banner
            WHERE
                page_id = '${id}' AND locale = '${locale}'
            ORDER BY index_number ASC
        `);
        const {rows:pageSlides} = await client.query(`
            SELECT
                *
            FROM
                page_slide
            WHERE
                page_id = '${id}' AND locale = '${locale}'
            ORDER BY index_number ASC
        `);



        const result = {
            ...page[0],
            banners: pageBanners,
            slides: pageSlides
        } as any


        const getProductsQuery = (orderBy: string) => {
            return `
                SELECT product_localized_info.name, product_localized_info.image_alt , product_image.image_url, special_offer_product.index_number as product_is_special_offer_product, product_model.price, product_model.discounted_price, product_model.price_is_dynamic, product_model.available_amount, product_model.frozen_amount_in_warehouse, (select sum(soled_amount) as soled_amount from product_model t WHERE product.id = t.product_id ),
                    product.id, product.slug, product.weight, product.pid, product.created_at, product.product_category_id, product.last_modified_at
                FROM
                    product

                LEFT JOIN
                    product_localized_info
                ON

                    product.id = product_localized_info.id and
                    product_localized_info.locale = '${locale}'


                LEFT JOIN
                    product_image
                ON

                    product.id = product_image.product_id

                AND
                    product_image.index_number = 1


                LEFT JOIN
                    special_offer_product
                ON

                    product.id = special_offer_product.product_id


                LEFT JOIN (
                    SELECT
                        product_model.product_id,
                        MIN(product_model.index_number) as join_condition
                    FROM
                        product_model
                    WHERE
                        product_model.available_amount > product_model.frozen_amount_in_warehouse
                    GROUP BY
                        product_model.product_id
                ) conditional_join_query_3 ON product.id = conditional_join_query_3.product_id

                LEFT JOIN
                    product_model
                ON

                    product.id = product_model.product_id
                AND 
                    product_model.index_number = COALESCE(conditional_join_query_3.join_condition, 1)

                WHERE ( product.published = true )
                AND  discounted_price is not null
                ORDER BY
                    (product_model.available_amount > product_model.frozen_amount_in_warehouse is false),
                    ${orderBy}
                LIMIT 15
                OFFSET 0
            `
        }
        const specialOfferProductsQuery = `
            SELECT product.pid, product.weight, product.slug, product_localized_info.name, product_localized_info.image_alt, product_image.image_url, product_model.price, product_model.discounted_price, product_model.price_is_dynamic, product_model.available_amount, product_model.frozen_amount_in_warehouse,
                special_offer_product.id, special_offer_product.product_id, special_offer_product.index_number, special_offer_product.created_at, special_offer_product.last_modified_at
            FROM
                special_offer_product

            LEFT JOIN
                product
            ON
                special_offer_product.product_id = product.id
            LEFT JOIN
                product_localized_info
            ON

                special_offer_product.product_id = product_localized_info.id
            AND product_localized_info.locale = '${locale}'

            LEFT JOIN
                product_image
            ON

                special_offer_product.product_id = product_image.product_id

            AND
                product_image.index_number = 1

            LEFT JOIN (
                SELECT
                    product_model.product_id,
                    MIN(product_model.index_number) as join_condition
                FROM
                    product_model
                WHERE
                    product_model.available_amount > product_model.frozen_amount_in_warehouse
                GROUP BY
                    product_model.product_id
            ) conditional_join_query_3 ON special_offer_product.product_id = conditional_join_query_3.product_id

            LEFT JOIN
                product_model
            ON

                special_offer_product.product_id = product_model.product_id
            AND 
                product_model.index_number = COALESCE(conditional_join_query_3.join_condition, 1)
            ORDER BY
                special_offer_product.index_number ASC
            LIMIT 15
            OFFSET 0
        `

        const selectedBrandsQuery = `
            SELECT product_brand.slug, product_brand.icon_url, product_brand_localized_info.name, (select max(t.discounted_price) as max_price from product_model t WHERE selected_product_brand.product_brand_id = t.product_brand_id AND (t.discounted_price is not null and t.discounted_price > 0)),
                selected_product_brand.id, selected_product_brand.product_brand_id, selected_product_brand.index_number, selected_product_brand.created_at, selected_product_brand.last_modified_at
            FROM
                selected_product_brand

            LEFT JOIN
                product_brand
            ON

                selected_product_brand.product_brand_id = product_brand.id


            LEFT JOIN
                product_brand_localized_info
            ON

                selected_product_brand.product_brand_id = product_brand_localized_info.id
            AND product_brand_localized_info.locale = '${locale}'



            ORDER BY
                selected_product_brand.index_number ASC
            LIMIT 20
            OFFSET 0
        `
        const rootProductCategoriesQuery = `
            SELECT product_category_localized_info.name, product_category_localized_info.description , (select max(discounted_price) as max_price from product_model t WHERE product_category.id = t.product_category_id AND (t.discounted_price is not null and t.discounted_price > 0)),
                product_category.id, product_category.slug, product_category.icon_url, product_category.parent_id, product_category.contains, product_category.created_at, product_category.last_modified_at
            FROM
                product_category

            LEFT JOIN
                product_category_localized_info
            ON

                product_category.id = product_category_localized_info.id and
                product_category_localized_info.locale = '${locale}'

            WHERE (
                product_category.homepage_index IS NOT NULL AND product_category.homepage_index <> 0
            )
            ORDER BY
                product_category.homepage_index asc
            LIMIT 30
            OFFSET 0
        `


        switch (id) {
            case 'home':
                const {rows: topSellerProducts} = await client.query(getProductsQuery("soled_amount desc"))
                const {rows: newestProducts} = await client.query(getProductsQuery("created_at desc"))
                const {rows: specialOfferProducts} = await client.query(specialOfferProductsQuery)
                const {rows: selectedBrands} = await client.query(selectedBrandsQuery)
                const {rows: rootProductCategories} = await client.query(rootProductCategoriesQuery)
                result.topSellerProducts = topSellerProducts
                result.newestProducts = newestProducts
                result.specialOfferProducts = specialOfferProducts
                result.selectedBrands = selectedBrands
                result.rootProductCategories = rootProductCategories
                break;
        
            default:
                break;
        }


        return result

    } catch (error:any) {
        throw new Error("useCases.errors.general.unExpected");
    }finally {
        await client.end()
    }
}