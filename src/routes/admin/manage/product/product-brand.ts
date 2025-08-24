export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateDescription,
        makeValidateHTML,
        validateSlug
    } = useValidators()


    const {
        generateId,
        validateHTML: html
    } = useFrameworks()

    const validateString = makeValidateString()
    const validateUrl = makeValidateUrl(false)
    const validateHTML = makeValidateHTML(html)
    const validateImageUrl = makeValidateUrl(false)

    const visibleFields = [
        'id',
        'slug',
        'icon_url',
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
            middleware: [adminIsAuthenticated, adminHasAccessTo],
            options: {
                // collectView: true,
                collectLog: true,
                serverJsonSizeLimit: "1mb",
                serverUrlEncodedSizeLimit: "1mb"
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
                    image_url: {
                        validator: validateImageUrl
                    },
                    seo_title: {
                        validator:validateString,
                    },
                    tags: {
                        validator:validateString,
                    },
                    seo_description: {
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
                    has_landing_page: {
                        type: 'boolean',
                    },
                    show_best_seller: {
                        type: "boolean",
                    },
                    show_newest: {
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
                        relationalFilters: [
                            {
                                tableName: "selected_product_brand",
                                fields: {
                                    product_brand_is_selected: {
                                        type: "boolean",
                                        filterType: "existence"
                                    }
                                },
                                parentId: "id",
                                childId: "product_brand_id",
                            },
                            {
                                tableName: "product_category_suggested_brand",
                                fields: {
                                    brand_not_suggested_to_product_category: {
                                        validator:validateULID,
                                        target: "product_category_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_brand_id",
                            },
                            {
                                tableName: "product_category_brand",
                                fields: {
                                    brand_not_included_in_product_category: {
                                        validator:validateULID,
                                        target: "product_category_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_brand_id",
                            }
                        ],
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields
                        }
                    }
                },
                getFile: {
                    disabled: false,
                    options: {
                        relationalFilters: [
                            {
                                tableName: "selected_product_brand",
                                fields: {
                                    product_brand_is_selected: {
                                        type: "boolean",
                                        filterType: "existence"
                                    }
                                },
                                parentId: "id",
                                childId: "product_brand_id",
                            },
                            {
                                tableName: "product_category_suggested_brand",
                                fields: {
                                    brand_not_suggested_to_product_category: {
                                        validator:validateULID,
                                        target: "product_category_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_brand_id",
                            },
                        ],
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields
                        }
                    }
                },
                getOne: {
                    disabled: false,
                    options: {
                        localize: true,
                        id: {
                            validator: validateULID,
                            name: 'id'
                        },
                        extraTables: [
                            {
                                displayName: "slides",
                                tableName: "product_brand_slide",
                                parentId: "id",
                                passLocale: true,
                                childId: "product_brand_id",
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "suggested_products",
                                tableName: "product_brand_suggested_product",
                                parentId: "id",
                                childId: "product_brand_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product",
                                            fields: [
                                                "slug",
                                            ],
                                            parentId: "product_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "product_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_image",
                                            fields: [
                                                "image_url",
                                            ],
                                            parentId: "product_id",
                                            childId: "product_id",
                                            extraFilters: "product_image.index_number = 1"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                        ],
                    }
                },
                checkUniqueness: {
                    disabled: false
                },
                create: {
                    disabled: false,
                    options: {
                        autoGenerateIdFunction: generateId,
                    }
                },
                update: {
                    disabled: false,
                },
                delete: {
                    disabled: false,
                },
                bulkUpdate: {
                    disabled: true,
                },
                bulkDelete: {
                    disabled: true,
                },
                createLocale: {
                    disabled: false,
                },
                updateLocale: {
                    disabled: false
                },
                deleteLocale: {
                    disabled: false
                },
                getLocale: {
                    disabled: false,
                },
                getLocales: {
                    disabled: false,
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

    async function adminHasAccessTo(request:any) {
        const admin = request.md_data.author

        if (admin.role_id) {
            const accessGroups = admin.role_access_level.map((al:any) => {
                return al.access_group
            })

            if (!accessGroups.includes('productManagement')) {
                return {
                    statusCode: 403,
                    body: {
                        message: "useCases.errors.general.accessDenied"
                    }
                }
            }

        }
        return {
            statusCode: 200,
            body: {}
        }
    }
}
