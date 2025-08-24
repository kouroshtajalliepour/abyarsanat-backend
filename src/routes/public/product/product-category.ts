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
    const validateProductCategorySliderType = makeValidateString(['container', 'full-screen'])
    const validateProductCategoryContains = makeValidateString(['product', 'product_category'])
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
                tableName: 'product_category',
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
                    slider_type: {
                        allowedToBeNull: true,
                        validator: validateProductCategorySliderType
                    },
                    contains: {
                        allowedToBeNull: true,
                        validator: validateProductCategoryContains
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
                    disabled: false,
                    options: {
                        maxRequests: 10,
                        relationalFilters: [
                            {
                                tableName: "product_category_suggested_sub_category",
                                fields: {
                                    product_category_not_suggested_to_product_category: {
                                        validator:validateULID,
                                        target: "product_sub_category_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_sub_category_id",
                            },
                        ],
                        inheritanceFilter: {
                            tableName: "product_category",
                            id: {
                                validator: validateULID,
                            }
                        },
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields,
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
                        }
                    }
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
                                displayName: "filters",
                                tableName: "product_category_filter",
                                parentId: "id",
                                childId: "product_category_id",
                                // passLocale: true,
                                // localized: true,
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product_category_filter_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "id",
                                            childId: "id"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "created_at desc",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "product_models",
                                tableName: "product_model",
                                parentId: "id",
                                childId: "product_category_id",
                                extraFilter: "discounted_price is not null and discounted_price > 0",
                                visibleFields: {
                                    basic: [
                                        "max(discounted_price) as max_price",
                                    ],
                                },
                            },
                            {
                                displayName: "filter_values",
                                tableName: "product_category_filter_value",
                                parentId: "id",
                                childId: "product_category_id",
                                // passLocale: true,
                                // localized: true,
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product_category_filter_value_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "id",
                                            childId: "id",
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "created_at desc",
                                    limit: 200
                                }
                            },
                            {
                                displayName: "sub_categories",
                                tableName: "product_category",
                                parentId: "id",
                                childId: "parent_id",
                                // passLocale: true,
                                // localized: true,
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product_category_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "id",
                                            childId: "id",
                                        },
                                    ],
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
                                
                                multiOptions: {
                                    orderBy: "created_at desc",
                                    limit: 20
                                }
                            },
                        ],
                        inheritance: {
                            tableName: 'product_category',
                            visibleFields: {
                                localized: [
                                    {
                                        key: 'name',
                                        name: 'name',
                                        parentKey: "name",
                                    },
                                    {
                                        key: 'seo_title',
                                        name: 'seo_title',
                                        parentKey: "seo_title",
                                    },
                                ],
                                basic: [
                                    {
                                        key: 'slug',
                                        name: 'slug',
                                        parentKey: "slug",
                                    }
                                ],
                            }
                        }
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
