export default (app:IApp) => {

    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        validateULID,
        makeValidateString
    } = useValidators()

    const {tables} = useRuntimeConfig()
    const validateString = makeValidateString()
    const validateTableName = makeValidateString()
    const validateOperation = makeValidateString(['INSERT', 'UPDATE', 'DELETE'])

    const visibleFields = [
        'row_id',
        'created_at',
        'table_name',
        'operation',
        'author',
        'author_token_id',
        'author_role',
        'author_ip',
        'locale',
        'new_value',
        'old_value',
    ]
    
    
    return useRoutes({
        app,
        middleware: [adminIsAuthenticated, adminHasAccessTo],
        db: {
            tableName: 'log',
            id: {
                validator: validateULID
            },
            localizedFields: {},
            fields: {
                author: {
                    validator: validateULID
                },
                row_id: {
                    validator: validateString
                },
                author_ip: {
                    validator: validateString
                },
                operation: {
                    validator: validateOperation
                },
                table_name: {
                    validator: validateTableName,
                    filterType: 'allowedToBeArray'
                },
            },
        },
        routes: {
            get: {
                disabled: false,
                options: {
                    relationalFilters: [],
                    visibleFields: {
                        basic: visibleFields
                    }
                }
            },
            getFile: {
                disabled: true,
            },
            getOne: {
                disabled: true
            },
            checkUniqueness: {
                disabled: true
            },
            create: {
                disabled: true
            },
            update: {
                disabled: true
            },
            bulkUpdate: {
                disabled: true,
            },
            bulkDelete: {
                disabled: true,
            },
            delete: {
                disabled: true
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
                disabled: true
            },
        },
        options: {collectLog:true}

    })

    async function adminHasAccessTo(request:any) {
        const admin = request.md_data.author

        if (admin.role_id) {
            const accessGroups = admin.role_access_level.map((al:any) => {
                return al.access_group
            })

            if (!accessGroups.includes('logManagement')) {
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
