export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        makeValidateString,
        validateULID,
    } = useValidators()

    const {
        accessGroups
    } = useRuntimeConfig()


    const {
        generateId
    } = useFrameworks()

    const validateAccessGroup = makeValidateString(accessGroups)

    const visibleFields = [
        'id',
        'access_group',
        'created_at',
        'role_id'
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
                tableName: 'admin_role_access',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {},
                fields: {
                    access_group: {
                        validator:validateAccessGroup,
                    },
                    role_id: {
                        validator:validateULID
                    },                    
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        relationalFilters: [],
                        visibleFields: {
                            basic: visibleFields,
                        },

                    }
                },
                checkUniqueness: {
                    disabled: false,
                    options: {
                        relationalFields: true
                    }
                },
                create: {
                    disabled: false,
                    options: {
                        autoGenerateIdFunction: generateId,
                    }
                },
                delete: {
                    disabled: false,
                },
                getFile: {
                    disabled: false,
                    options: {
                        relationalFilters: [],
                        visibleFields: {
                            basic: visibleFields,
                        }
                    }
                },
                getOne: {
                    disabled: true,
                },
                update: {
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
