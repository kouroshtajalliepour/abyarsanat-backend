export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        validateULID,
        validateNumber
    } = useValidators()


    const {
        generateId
    } = useFrameworks()

    const visibleFields = [
        'id',
        'product_id',
        'product_category_filter_id',
        'product_category_filter_value_id',
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
                tableName: 'product_filter',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {},
                fields: {       
                    product_id: {
                        validator: validateULID,
                    },
                    product_category_filter_id: {
                        validator: validateULID,
                    },
                    product_category_filter_serial_id: {
                        validator: validateNumber,
                    },
                    product_category_filter_value_id: {
                        validator: validateULID,
                        allowedToBeNull: true
                    },
                    product_category_filter_value_serial_id: {
                        validator: validateNumber,
                        allowedToBeNull: true
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
                                    tableName: 'product_category_filter',
                                    fields: [
                                        'slug',
                                    ],
                                    parentId: "product_category_filter_id",
                                    childId: "id"
                                },
                                {
                                    tableName: 'product_category_filter_localized_info',
                                    fields: [
                                        'name',
                                    ],
                                    parentId: "product_category_filter_id",
                                    childId: "id"
                                },
                                {
                                    tableName: 'product_category_filter_value',
                                    fields: [
                                        'slug as value_slug',
                                    ],
                                    parentId: "product_category_filter_value_id",
                                    childId: "id"
                                },
                                {
                                    tableName: 'product_category_filter_value_localized_info',
                                    fields: [
                                        'name as value_name',
                                    ],
                                    parentId: "product_category_filter_value_id",
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
                                    tableName: 'product_category_filter',
                                    fields: [
                                        'slug',
                                    ],
                                    parentId: "product_category_filter_id",
                                    childId: "id"
                                },
                                {
                                    tableName: 'product_category_filter_localized_info',
                                    fields: [
                                        'name',
                                    ],
                                    parentId: "product_category_filter_id",
                                    childId: "id"
                                },
                                {
                                    tableName: 'product_category_filter_value',
                                    fields: [
                                        'slug as value_slug',
                                    ],
                                    parentId: "product_category_filter_value_id",
                                    childId: "id"
                                },
                                {
                                    tableName: 'product_category_filter_value_localized_info',
                                    fields: [
                                        'name as value_name',
                                    ],
                                    parentId: "product_category_filter_value_id",
                                    childId: "id"
                                },
                            ]
                        }
                    }
                },
                getOne: {
                    disabled: false,
                    options: {
                        localize: false,
                        extraTables:[
                            {
                                displayName: "category_filter",
                                tableName: "product_category_filter",
                                parentId: "product_category_filter_id",
                                localized: true,
                                childId: "id",
                            },
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
