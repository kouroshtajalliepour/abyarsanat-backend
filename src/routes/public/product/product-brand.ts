export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateDescription,
        validateSlug,
        makeValidateHTML
    } = useValidators()


    const {
        generateId,
        validateHTML: html
    } = useFrameworks()

    const validateString = makeValidateString()
    const validateUrl = makeValidateUrl(false)
    const validateHTML = makeValidateHTML(html)

    const visibleFields = [
        'id',
        'slug',
        'icon_url',
        'parent_id',
        'contains',
        'created_at',
        'last_modified_at'
    ]
    const visibleLocalizedFields = [
        'name',
        'description'
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
                tableName: 'product_brand',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                    name: {
                        validator:validateString,
                        filterType: "like"
                    },
                    description: {
                        validator:validateDescription,
                    },
                    content: {
                        validator: validateHTML
                    },
                },
                fields: {
                    slug: {
                        validator:validateSlug,
                        unique: true
                    },
                    parent_id: {
                        validator: validateULID,
                        allowedToBeNull: true 
                    },
                    has_landing_page: {
                        type: 'boolean',
                    },
                    show_promoted_products: {
                        type: "boolean"
                    },
                    show_sub_categories: {
                        type: "boolean"
                    },
                    show_top_sales: {
                        type: "boolean"
                    },
                    show_description: {
                        type: "boolean"
                    },
                    icon_url: {
                        validator:validateUrl
                    },                    
                },
            },
            routes: {
                get: {
                    disabled: true,
                },
                getFile: {
                    disabled: true,
                },
                getOne: {
                    disabled: false,
                    options: {
                        localize: true,
                        id: {
                            validator: validateSlug,
                            name: 'slug'
                        },
                        extraTables: [
                            {
                                displayName: "product_models",
                                tableName: "product_model",
                                parentId: "id",
                                childId: "product_brand_id",
                                extraFilter: "discounted_price is not null and discounted_price > 0",
                                visibleFields: {
                                    basic: [
                                        "max(discounted_price) as max_price",
                                    ],
                                },
                            },
                        ],
                    }
                },
                checkUniqueness: {
                    disabled: true
                },
                create: {
                    disabled: true,
                    options: {
                        autoGenerateIdFunction: generateId,
                    }
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
                    options: {
                        id: {
                            validator: validateULID,
                            name: 'id'
                        }
                    }
                },
            },

        }
    )
}
