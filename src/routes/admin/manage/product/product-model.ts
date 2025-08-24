export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

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
        'slug',
        'price',
        'image_url',
        'discounted_price',
        'product_guaranty_id',
        'created_at',
        'last_modified_at'
    ]
    const visibleLocalizedFields = [
        'id',
        'name'
    ]


    return useRoutes(
        {
            app,
            middleware: [adminIsAuthenticated, adminHasAccessTo],
            options: {
                // collectView: true,
                collectLog: true,
                // useCaptcha: true,
            },
            db: {
                tableName: 'product_model',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                    name: {
                        validator: validateString,
                    },
                },
                fields: {       
                    product_id: {
                        validator: validateULID,
                    },
                    product_category_id: {
                        validator: validateULID,
                    },
                    product_brand_id: {
                        validator: validateULID,
                    },
                    slug: {
                        validator: validateSlug,
                        unique: true
                    },
                    index_number: {
                        validator: validateString,
                        type: "number"
                    },
                    price_is_dynamic: {
                        type: "boolean",
                    },
                    price: {
                        validator: validateNumber,
                    },
                    discounted_price: {
                        validator: validateNumber,
                    },
                    available_amount: {
                        validator: validateNegativeNumber,
                    },
                    frozen_amount_in_warehouse: {
                        validator: validateNegativeNumber,
                    },
                    max_amount_purchaseable: {
                        validator:validateNumber,
                    }, 
                    product_guaranty_id: {
                        validator: validateULID,
                    },
                    image_url: {
                        validator: validateImageUrl
                    },
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields,
                            singularRelations: [
                                // {
                                //     tableName: 'product_category_model',
                                //     fields: [
                                //         'slug',
                                //     ],
                                //     parentId: "product_category_model_id",
                                //     childId: "id"
                                // },
                                // {
                                //     tableName: 'product_category_model_localized_info',
                                //     fields: [
                                //         'name',
                                //     ],
                                //     parentId: "product_category_model_id",
                                //     childId: "id"
                                // },
                            ]
                        }
                    }
                },
                getFile: {
                    disabled: false,
                    options: {
                        visibleFields: {
                            basic: [
                                'available_amount',
                                'price',
                                'discounted_price',
                                'created_at',
                            ],
                            localized: ["name"],
                            singularRelations: [
                                {
                                    tableName: 'product_localized_info',
                                    fields: [
                                        'name',
                                    ],
                                    parentId: "product_id",
                                    childId: "id"
                                },
                                // {
                                //     tableName: 'product_category_model_localized_info',
                                //     fields: [
                                //         'name',
                                //     ],
                                //     parentId: "product_category_model_id",
                                //     childId: "id"
                                // },
                            ]
                        }
                    }
                },
                getOne: {
                    disabled: false,
                    options: {
                        localize: true,
                        extraTables:[
                            {
                                displayName: "product",
                                tableName: "product",
                                parentId: "product_id",
                                localized: true,
                                childId: "id",
                            },
                        ],
                        id: {
                            validator: validateULID,
                            name: 'id'
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
                    options: {
                        notify: async function(config:any){
            
                            
                            // if(config && config.old?.status && config.new?.status && config.new.status != config.old?.status){
                            //     const {
                            //         new: {
                            //             status,
                            //             sms,
                            //             ceo_name,
                            //             ceo_phone_number
                            //         },
                            //     } = config
                
                            //     await notify({
                            //         phone_number: ceo_phone_number,
                            //         full_name: ceo_name,
                            //         message:sms,
                            //         type: status
                            //     })
                            // }
                        },
                    }
                },
                delete: {
                    disabled: false,
                    options: {
                        shiftIndex: true,
                        shiftIndexKey: "product_id"
                    }
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
