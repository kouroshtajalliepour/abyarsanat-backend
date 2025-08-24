export default (app:IApp) => {

    const {
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateNumber,
        validateNegativeNumber,
        validateSlug
    } = useValidators()


    const {
        generateId
    } = useFrameworks()

    const validateString = makeValidateString()
    const validateImageUrl = makeValidateUrl(false)
    const validateUrl = makeValidateUrl(true)

    const visibleFields = [
        'id',
        'product_id',
        'index_number',
        'created_at',
        'last_modified_at'
    ]


    return useRoutes(
        {
            app,
            middleware: [],
            options: {
                // collectView: true,
                collectLog: true,
                // useCaptcha: true,
            },
            db: {
                tableName: 'special_offer_product',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                },
                fields: {       
                    product_id: {
                        validator: validateULID,
                    },
                    index_number: {
                        validator: validateString,
                        type: "number"
                    },
                },
            },
            // todo add order by logic for join statements
            routes: {
                get: {
                    disabled: false,
                    options: {
                        visibleFields: {
                            basic: visibleFields,
                            singularRelations: [
                                {
                                    tableName: 'product',
                                    fields: [
                                        'pid',
                                        "weight",
                                        'slug',
                                    ],
                                    parentId: "product_id",
                                    childId: "id"
                                },
                                {
                                    tableName: 'product_localized_info',
                                    fields: [
                                        'name',
                                    ],
                                    parentId: "product_id",
                                    childId: "id"
                                },
                                {
                                    tableName: "product_image",
                                    fields: [
                                        "image_url"
                                    ],
                                    parentId: "product_id",
                                    childId: "product_id",
                                    extraFilters: "product_image.index_number = 1"
                                },
                                {
                                    tableName: "product_model",
                                    fields: [
                                        "price",
                                        "discounted_price",
                                        // "max(discounted_price) as max_price",
                                        "price_is_dynamic",
                                        "available_amount",
                                        "frozen_amount_in_warehouse"
                                    ],
                                    parentId: "product_id",
                                    childId: "product_id",
                                    dynamicJoin: {
                                        by: "product_model.index_number",
                                        operator: "MIN",
                                        defaultAnswer: '1',
                                        condition: "product_model.available_amount > product_model.frozen_amount_in_warehouse"
                                    },
                                    // extraFilters: `(
                                    //     (product_model.index_number = 1 and product_model.available_amount > product_model.frozen_amount_in_warehouse)
                                    //     OR
                                    //     (product_model.available_amount > product_model.frozen_amount_in_warehouse and product_model.index_number = 2)
                                    //     OR
                                    //     product_model.index_number = 1
                                    // )`
                                    // extraFilters: "product_model.index_number = 1"
                                    // extraFilters: "product_model.available_amount < product_model.frozen_amount_in_warehouse"
                                    // extraFilters: "((product_model.available_amount < product_model.frozen_amount_in_warehouse and product_model.index_number = 1) or product_model.available_amount < product_model.frozen_amount_in_warehouse)"
                                },
                            ]
                        }
                    }
                },
                getFile: {
                    disabled: true,
                },
                getOne: {
                    disabled: true,
                },
                checkUniqueness: {
                    disabled: true
                },
                create: {
                    disabled: true,
                },
                update: {
                    disabled: true,
                },
                delete: {
                    disabled: true,
                },
                bulkUpdate: {
                    disabled: true,
                },
                bulkDelete: {
                    disabled: true,
                },
                createLocale: {
                    disabled: true,
                },
                updateLocale: {
                    disabled: true
                },
                deleteLocale: {
                    disabled: true
                },
                getLocale: {
                    disabled: true,
                },
                getLocales: {
                    disabled: true,
                },
            },

        }
    )

}
