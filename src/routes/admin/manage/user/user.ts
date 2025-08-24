export default (app:IApp) => {

    const {
        adminIsAuthenticated,
    } = useMiddlewares();

    const {
        makeValidatePassword,
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateIranianPhoneNumber,
        validateEmail

    } = useValidators()

    const {
        generateId
    } = useFrameworks()

    const {pages} = useRuntimeConfig()
    const validateString = makeValidateString()

    const visibleFields = [
        'id',
        'phone_number',
        'first_name',
        'last_name',
        'confirmed',
        'blocked',
        'email',
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
                tableName: '_user',
                id: {
                    validator: validateULID
                },
                localizedFields: {},
                fields: {
                    first_name: {
                        validator:validateString
                    },
                    last_name: {
                        validator:validateString
                    },
                    email: {
                        validator:validateEmail,
                        unique: true
                    },
                    phone_number: {
                        validator:validateIranianPhoneNumber,
                        unique: true
                    },
                    blocked: {
                        type: 'boolean',
                        allowedToBeNull: true
                    },
                    confirmed: {
                        type: 'boolean',
                        allowedToBeNull: true
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
                getFile: {
                    disabled: false,
                    options: {
                        relationalFilters: [],
                        visibleFields: {
                            basic: visibleFields,
                        },
                    }
                },
                getOne: {
                    disabled: false,
                    options: {
                        id: {
                            validator: validateULID
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
                    disabled: true
                },
                updateLocale: {
                    disabled: true
                },
                deleteLocale: {
                    disabled: true
                },
                getLocale: {
                    disabled: true
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

            if (!accessGroups.includes('userManagement')) {
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
