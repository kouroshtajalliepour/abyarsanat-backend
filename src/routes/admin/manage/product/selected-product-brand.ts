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
        'product_brand_id',
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
                            singularRelations: [
                                {
                                    tableName: 'product_brand',
                                    fields: [
                                        'pid',
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
                    disabled: true,
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
                    options: {
                        shiftIndex: true,
                    }
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

    async function adminHasAccessTo(request:any) {
        const admin = request.md_data.author

        if (admin.role_id) {
            const accessGroups = admin.role_access_level.map((al:any) => {
                return al.access_group
            })

            if (!accessGroups.includes('pageManagement')) {
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
