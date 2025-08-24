export default (app:IApp) => {

    const {
        adminIsAuthenticated,
    } = useMiddlewares();

    const {
        makeValidatePassword,
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateEmail

    } = useValidators()

    const {
        secret:{
            admin: {
                passwordToken, 
            }
        },
    } = useRuntimeConfig()

    const {
        encryption,
        generateId
    } = useFrameworks()

    const validateString = makeValidateString()
    const validateUrl = makeValidateUrl(false)
    const validatePassword = makeValidatePassword(['uppercase', 'lowercase', 'number', 'symbol'])

    const visibleFields = [
        'id',
        'username',
        'first_name',
        'last_name',
        'image_url',
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
                tableName: 'admin',
                id: {
                    validator: validateULID
                },
                localizedFields: {},
                fields: {
                    username: {
                        validator:validateString,
                        unique: true
                    },
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
                    image_url: {
                        validator:validateUrl,
                    },
                    role_id: {
                        validator:validateULID,
                    },
                    hashed_data: {
                        validator: validatePassword,
                        constructor: generateAdminPassword
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
                            singularRelations: [
                                {
                                    tableName: "admin_role_localized_info",
                                    fields: ['name as role_name'],
                                    parentId: "role_id",
                                    childId: "id",
                                }
                            ]
                        },
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
                                    tableName: "admin_role_localized_info",
                                    fields: ['name as role_name'],
                                    parentId: "role_id",
                                    childId: "id",
                                }
                            ]
                        }
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


    async function generateAdminPassword(password:string, id:string)  {
        const key :any= encryption.convertPasswordToBase32(
            passwordToken,
            password
        )
        return await encryption.encrypt(id, key) as any;
    }
}
