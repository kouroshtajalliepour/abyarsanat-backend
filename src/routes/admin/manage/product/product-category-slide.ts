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
        'product_category_id',
        'product_id',
        'created_at',
        'last_modified_at'
    ]
    const visibleLocalizedFields = [
        'name',
        'description'
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
                tableName: 'product_category_slide',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {},
                fields: {       
                    product_category_id: {
                        validator: validateULID,
                    },
                    image_url: {
                        validator: validateImageUrl
                    },
                    index_number: {
                        validator: validateString,
                        type: "number"
                    },
                    url: {
                        validator: validateUrl
                    },
                    locale: {
                        validator: validateString
                    },
                    image_alt: {
                        validator: validateString
                    },
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        relationalFilters: [],
                        visibleFields: {
                            basic: [
                                'id',
                                'product_category_id',
                                'image_url',
                                'image_alt',
                                'index_number',
                                'url',
                                'locale',
                                'created_at',
                                'last_modified_at',
                            ]
                        }
                    }
                },
                create: {
                    disabled: false,
                    options: {
                        autoGenerateIdFunction: generateId,
                    }
                },
                checkUniqueness: {
                    disabled: false,
                    options: {
                        relationalFields: true
                    }
                },
                delete: {
                    disabled: false,
                    options: {
                        shiftIndex: true,
                        shiftIndexKey: "product_category_id"
                    }
                },
                getFile: {
                    disabled: true
                },
                getOne: {
                    disabled: true,
                },
                
                update: {
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
