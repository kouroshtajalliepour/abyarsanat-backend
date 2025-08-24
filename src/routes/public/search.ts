export default (app:IApp) => {

    const {
        makeValidateString,
    } = useValidators()

    const validateString = makeValidateString()

    return useSearchRoute(
        {
            app,
            middleware: [],
            options: {
                // collectView: true,
                maxRequests: 10
                // useCaptcha: true,
            },
            db: {
                searchInputValidator: validateString,
                tables: [
                    {
                        tableName: "product",
                        targets: [
                            "product_localized_info.name"
                        ],
                        visibleFields : [
                            "'0' as max_price",
                            "product.slug",
                            "product.created_at",
                            "product.id",
                            'product_localized_info.name',
                            'product_image.image_url'
                        ],
                        localized: true,
                        singularRelations: [
                            {
                                tableName: "product_image",
                                parentId: "id",
                                childId: "product_id",
                                extraFilters: "product_image.index_number = 1"
                            },
                        ],
                        extraFilters: "product.published is true",
                        multiRelations: []
                    },
                    {
                        tableName: "product_category",
                        targets: [
                            "product_category_localized_info.name",
                        ],
                        visibleFields : [
                            "product_category.slug",
                            "product_category.created_at",
                            "product_category.id",
                            'product_category_localized_info.name',
                            'product_category.icon_url as image_url'
                        ],
                        localized: true,
                        singularRelations: [],
                        multiRelations: [
                            {
                                tableName: "product_model",
                                fields: [
                                    "max(discounted_price) as max_price",
                                ],
                                extraFilters: "t.discounted_price is not null and t.discounted_price > 0",
                                parentId: "id",
                                childId: "product_category_id",
                            },   
                        ]
                    },
                ]
            },

        }
    )
}
