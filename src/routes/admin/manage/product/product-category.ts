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
    const validateImageUrl = makeValidateUrl(false)

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
            middleware: [adminIsAuthenticated, adminHasAccessTo],
            options: {
                // collectView: true,
                collectLog: true,
                serverJsonSizeLimit: "1mb",
                serverUrlEncodedSizeLimit: "1mb"
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
                    homepage_index: {
                        validator: validateString,
                        type: "number"
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
                            localized: visibleLocalizedFields
                        }
                    }
                },
                getFile: {
                    disabled: false,
                    options: {
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
                                tableName: "product_category_slide",
                                parentId: "id",
                                passLocale: true,
                                childId: "product_category_id",
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "suggested_sub_categories",
                                tableName: "product_category_suggested_sub_category",
                                parentId: "id",
                                childId: "product_category_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product_category",
                                            fields: [
                                                "slug",
                                                "icon_url",
                                            ],
                                            parentId: "product_category_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_category_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "product_category_id",
                                            childId: "id"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "suggested_products",
                                tableName: "product_category_suggested_product",
                                parentId: "id",
                                childId: "product_category_id",
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
                            {
                                displayName: "suggested_brands",
                                tableName: "product_category_suggested_brand",
                                parentId: "id",
                                childId: "product_category_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product_brand",
                                            fields: [
                                                "slug",
                                                "icon_url",
                                            ],
                                            parentId: "product_brand_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_brand_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "product_brand_id",
                                            childId: "id"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "suggested_blogs",
                                tableName: "product_category_suggested_blog",
                                parentId: "id",
                                childId: "product_category_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "blog",
                                            fields: [
                                                "slug",
                                                "image_url",
                                            ],
                                            parentId: "blog_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "blog_localized_info",
                                            fields: [
                                                "title",
                                            ],
                                            parentId: "blog_id",
                                            childId: "id"
                                        },
                                    ],
                                },
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                        ],
                        inheritance: {
                            tableName: 'product_category',
                            visibleFields: {
                                localized: [{
                                    key: 'name',
                                    name: 'name',
                                    parentKey: "name",
                                }],
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
