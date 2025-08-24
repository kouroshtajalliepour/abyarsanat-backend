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
        validateSlug,
        validateNumber
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
        'pid',
        'created_at',
        'last_modified_at'
    ]
    const visibleLocalizedFields = [
        'name',
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
                tableName: 'product',
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
                    image_alt: {
                        validator:validateString,
                        filterType: "none"
                    },
                    price_based_on: {
                        validator:validateString,
                    },
                    seo_title: {
                        validator:validateString,
                    },
                    seo_description: {
                        validator:validateDescription,
                    },
                    tags: {
                        validator:validateString,
                    },
                    
                },
                fields: {
                    // * not in field
                    id: {
                        validator: validateULID,
                        dbName: 'id',
                        allowedToBeNull: true,
                        filterType: "isNot"
                    },
                    slug: {
                        validator:validateSlug,
                        unique: true
                    },                  
                    original_name: {
                        validator:validateString,
                    },               
                    pid: {
                        validator:validateSlug,
                        unique: true
                    },    
                    weight: {
                        validator:validateNumber,
                    }, 
                    x: {
                        validator:validateNumber,
                    },
                    y: {
                        validator:validateNumber,
                    }, 
                    z: {
                        validator:validateNumber,
                    }, 
                    has_multiple_types: {
                        type: "boolean"
                    }, 
                    show_models_as_radio: {
                        type: "boolean"
                    },
                    published: {
                        type: "boolean",
                        allowedToBeNull: true
                    }, 
                    product_category_id: {
                        validator:validateULID,
                        unique: true
                    },                  
                    product_brand_id: {
                        validator:validateULID,
                        unique: true,
                        allowedToBeNull: true
                    },                  
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        relationalFilters: [
                            {
                                tableName: "product_product",
                                fields: {
                                    product_not_related_to_product: {
                                        validator:validateULID,
                                        target: "product_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "related_product_id",
                            },
                            {
                                tableName: "special_offer_product",
                                fields: {
                                    product_is_special_offer: {
                                        type: "boolean",
                                        filterType: "existence"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                tableName: "product_category_suggested_product",
                                fields: {
                                    product_not_suggested_to_product_category: {
                                        validator:validateULID,
                                        target: "product_category_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                tableName: "product_brand_suggested_product",
                                fields: {
                                    product_not_suggested_to_brand: {
                                        validator:validateULID,
                                        target: "product_brand_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                tableName: "blog_product",
                                fields: {
                                    product_not_attached_to_blog: {
                                        validator:validateULID,
                                        target: "blog_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                        ],
                        inheritanceFilter: {
                            tableName: "product_category",
                            parentId: "parent_id",
                            // grandParentParentId: "parent_id",
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
                                tableName: "product_product",
                                fields: {
                                    product_not_related_to_product: {
                                        validator:validateULID,
                                        target: "product_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "related_product_id",
                            },
                            {
                                tableName: "special_offer_product",
                                fields: {
                                    product_is_special_offer: {
                                        type: "boolean",
                                        filterType: "existence"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                tableName: "product_category_suggested_product",
                                fields: {
                                    product_not_suggested_to_product_category: {
                                        validator:validateULID,
                                        target: "product_category_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                tableName: "product_brand_suggested_product",
                                fields: {
                                    product_not_suggested_to_brand: {
                                        validator:validateULID,
                                        target: "product_brand_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                            {
                                tableName: "blog_product",
                                fields: {
                                    product_not_attached_to_blog: {
                                        validator:validateULID,
                                        target: "blog_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_id",
                            },
                        ],
                        inheritanceFilter: {
                            tableName: "product_category_id",
                            parentId: "category_id",
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
                                displayName: "images",
                                tableName: "product_image",
                                parentId: "id",
                                childId: "product_id",
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "related_products",
                                tableName: "product_product",
                                parentId: "id",
                                childId: "product_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product",
                                            fields: [
                                                "slug",
                                            ],
                                            parentId: "related_product_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "related_product_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_image",
                                            fields: [
                                                "image_url",
                                            ],
                                            parentId: "related_product_id",
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
                                displayName: "available_insurances",
                                tableName: "product_available_insurance",
                                parentId: "id",
                                childId: "product_id",
                                visibleFields: {
                                    singularRelations: [
                                        {
                                            tableName: "product_insurance",
                                            fields: [
                                                "slug",
                                                "icon_url"
                                            ],
                                            parentId: "product_insurance_id",
                                            childId: "id"
                                        },
                                        {
                                            tableName: "product_insurance_localized_info",
                                            fields: [
                                                "name",
                                            ],
                                            parentId: "product_insurance_id",
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
                            parentId: 'product_category_id',
                            visibleFields: {
                                basic: [{
                                    key: 'slug',
                                    name: 'slug',
                                    parentKey: "slug",
                                }],
                                localized: [{
                                    key: 'name',
                                    name: 'name',
                                    parentKey: "name",
                                }],
                            }
                        }
                        // extraTables: [
                        //     {
                        //         displayName: "slides",
                        //         tableName: "product_slide",
                        //         parentId: "id",
                        //         childId: "product_id",
                        //         multiOptions: {
                        //             orderBy: "index_number ASC",
                        //             limit: 20
                        //         }
                        //     },
                        // ],
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
