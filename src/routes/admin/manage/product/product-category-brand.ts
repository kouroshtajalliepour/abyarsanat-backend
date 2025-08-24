export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        makeValidateString,
        validateULID,
        validateSlug
    } = useValidators()


    const {
        generateId
    } = useFrameworks()

    const validateString = makeValidateString()

    const visibleFields = [
        'id',
        'index_number',
        'created_at',
        'last_modified_at'
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
                tableName: 'product_category_brand',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                },
                fields: {
                    product_category_id: {
                        validator: validateULID,
                    },
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
                            localized: [],
                            singularRelations: [
                                {
                                    tableName: 'product_brand',
                                    fields: [
                                        'slug',
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
                            ]
                        }
                    }
                },
                getFile: {
                    disabled: false,
                    options: {
                        visibleFields: {
                            basic: visibleFields,
                            localized: [],
                            singularRelations: [
                                {
                                    tableName: 'product_brand',
                                    fields: [
                                        'slug',
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
                            ]
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
                                displayName: "category",
                                tableName: "product_category",
                                parentId: "product_category_id",
                                childId: "id",
                                localized: true
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
