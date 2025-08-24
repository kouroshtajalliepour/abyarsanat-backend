export default (app:IApp) => {
    
    
    const {
        
        encryption,
        generateId,
        sendMail,
        tokenFunctions
        
    } = useFrameworks();

    const {
        secret:{adminPasswordToken, loginToken, userOtpToken}
    } = useRuntimeConfig()

    const {
        captchaValidator,
        adminIsAuthenticated
    } = useMiddlewares();
    
    
    return useRoutes({
        app,
        middleware: [adminIsAuthenticated],
        db: {
            tableName: 'admin',
            id: {
                validator: (id:string) => {
                    return id
                }
            },
            localizedFields: {},
            fields: {
                confirmed: {
                    type: 'boolean',
                }
            },
        },
        routes: {
            get: {
                disabled: false,
                options: {
                    relationalFilters: [],
                    visibleFields: {
                        basic: [
                            'first_name', 'last_name', 'email', 'blocked', 'created_at'
                        ]
                    }
                }
            },
            getFile: {
                disabled: false,
                options: {
                    relationalFilters: [],
                    visibleFields: {
                        basic: [
                            'first_name', 'last_name', 'email', 'blocked', 'created_at'
                        ]
                    }
                }
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
                disabled: false,
                options: {
                    relationalFilters: [],
                    actions: {
                        toggle_confirmed: {
                            // query: "ADMIN.CONFIRMED = !ADMIN.CONFIRMED",
                            query: "confirmed = NOT confirmed",
                            type: 'boolean'
                            // validator: (yo:string) => {
                            //     return yo
                            // }
                        },
                        first_name: {
                            // query: "ADMIN.CONFIRMED = !ADMIN.CONFIRMED",
                            query: "first_name = {{VALUE}}",
                            // type: 'boolean'
                            validator: (yo:string) => {
                                return yo
                            }
                        }
                    },
                    notify:({filters, new:New, table_name, totalCount}) => {
                        logger.debug(`🚀 ~ file: manage.ts:61 ~ totalCount: ${totalCount}`)
                        logger.debug(`🚀 ~ file: manage.ts:61 ~ table_name: ${table_name}`)
                        logger.debug(`🚀 ~ file: manage.ts:61 ~ new: ${New}`)
                        logger.debug(`🚀 ~ file: manage.ts:61 ~ filters: ${filters}`)
                    }
                }
            },
            bulkDelete: {
                disabled: false,
                options: {
                    relationalFilters: [],
                    notify:({filters,  table_name, totalCount}) => {
                        logger.debug(`🚀 ~ file: manage.ts:73 ~ totalCount: ${totalCount}`)
                        logger.debug(`🚀 ~ file: manage.ts:61 ~ table_name: ${table_name}`)
                        logger.debug(`🚀 ~ file: manage.ts:61 ~ filters: ${filters}`)
                    }
                }
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
}
