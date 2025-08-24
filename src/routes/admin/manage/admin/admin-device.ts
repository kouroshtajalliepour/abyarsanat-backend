export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        validateULID,
    } = useValidators()

    const visibleFields = [
        'id',
        'admin_id',
        'platform',
        'blocked',
        'registered_ip',
        'created_at'
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
                tableName: 'admin_token',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {},
                fields: {
                    admin_id: {
                        validator: validateULID,
                    }
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        relationalFilters: [],
                        visibleFields: {
                            basic: visibleFields,
                            singularRelations: [
                                {
                                    tableName: "admin",
                                    fields: ['first_name as admin_first_name', 'last_name as admin_last_name'],
                                    parentId: "admin_id",
                                    childId: "id",
                                }
                            ]
                        }
                    }
                },
                
                getFile: {
                    disabled: false,
                    options: {
                        relationalFilters: [],
                        visibleFields: {
                            basic: visibleFields,
                            singularRelations: [
                                {
                                    tableName: "admin",
                                    fields: ['first_name as admin_first_name', 'last_name as admin_last_name'],
                                    parentId: "admin_id",
                                    childId: "id",
                                }
                            ]
                        }
                    }
                },
                getOne: {
                    disabled: true,
                },
                checkUniqueness: {
                    disabled: true
                },
                create: {
                    disabled: true,
                },
                update: {
                    disabled: true,
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

            if (!accessGroups.includes('adminManagement')) {
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
