export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateDescription,
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
        'product_id',
        'index_number',
        'created_at',
        'last_modified_at'
    ]
    const visibleLocalizedFields = [
        'key',
        'value'
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
                tableName: 'product_property',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                    key: {
                        validator: validateString,
                    },
                    value: {
                        validator: validateString,
                        filterType: "like"
                    },
                },
                fields: {       
                    product_id: {
                        validator: validateULID,
                    },
                    selected: {
                        type: 'boolean',
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
                            localized: visibleLocalizedFields
                        }
                    }
                },
                getFile: {
                    disabled: false,
                    options: {
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields
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
                    options: {
                        shiftIndex: true,
                        shiftIndexKey: "product_id"
                    }
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
