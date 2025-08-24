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
        'product_brand_id',
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
                tableName: 'selected_product_brand',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                },
                fields: {       
                    product_brand_id: {
                        validator: validateULID,
                    },
                    index_number: {
                        validator: validateString,
                        type: "number"
                    },
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        visibleFields: {
                            basic: visibleFields,
                            singularRelations: [
                                {
                                    tableName: 'product_brand',
                                    fields: [
                                        'slug',
                                        'icon_url',
                                    ],
                                    parentId: "product_brand_id",
                                    childId: "id"
                                },
                                {
                                    tableName: 'product_brand_localized_info',
                                    fields: [
                                        'name',
                                    ],
                                    parentId: "product_brand_id",
                                    childId: "id"
                                },
                            ],
                            multiRelations: [
                                {
                                    tableName: "product_model",
                                    fields: [
                                        "max(t.discounted_price) as max_price",
                                    ],
                                    extraFilters: "t.discounted_price is not null and t.discounted_price > 0",
                                    parentId: "product_brand_id",
                                    childId: "product_brand_id",
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
