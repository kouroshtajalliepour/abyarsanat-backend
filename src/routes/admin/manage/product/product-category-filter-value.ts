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
        'slug',
        'created_at',
        'serial_id',
        'index_number',
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
                // useCaptcha: true,
            },
            db: {
                tableName: 'product_category_filter_value',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                    name: {
                        validator:validateString,
                        filterType: "like"
                    },
                },
                fields: {
                    product_category_filter_id: {
                        validator: validateULID,
                    },
                    product_category_id: {
                        validator: validateULID,
                    },
                    slug: {
                        validator:validateSlug,
                        unique: true
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
                        relationalFilters: [
                            {
                                tableName: "product_filter",
                                fields: {
                                    filter_value_not_included_in_product: {
                                        validator:validateULID,
                                        target: "product_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_category_filter_value_id",
                            }
                        ],
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields,
                            singularRelations: [
                                {
                                    tableName: 'product_category_filter',
                                    fields: [
                                        'slug as filter_slug',
                                    ],
                                    parentId: "product_category_filter_id",
                                    childId: "id"
                                },
                            ]
                        }
                    }
                },
                getFile: {
                    disabled: false,
                    options: {
                        relationalFilters: [
                            {
                                tableName: "product_filter",
                                fields: {
                                    filter_value_not_included_in_product: {
                                        validator:validateULID,
                                        target: "product_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_category_filter_value_id",
                            }
                        ],
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields,
                            singularRelations: [
                                {
                                    tableName: 'product_category_filter',
                                    fields: [
                                        'slug as filter_slug',
                                    ],
                                    parentId: "product_category_filter_id",
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
                                displayName: "filter",
                                tableName: "product_category_filter",
                                parentId: "product_category_filter_id",
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
