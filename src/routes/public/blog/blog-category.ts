export default (app:IApp) => {
    const {
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
    const validateUrl = makeValidateUrl(false)

    const visibleFields = [
        'id',
        'slug',
        'icon_url',
        'created_at',
        'last_modified_at'
    ]
    const visibleLocalizedFields = [
        'name',
    ]

    return useRoutes(
        {
            app,
            middleware: [],
            options: {
                // collectView: true,
                collectLog: true,
                // useCaptcha: true,
            },
            db: {
                tableName: 'blog_category',
                id: {
                    validator: validateULID,
                    dbName: 'id'
                },
                localizedFields: {
                    name: {
                        validator:validateString,
                        filterType: "like"
                    },
                    description: {
                        validator:validateDescription,
                    },
                },
                fields: {
                    slug: {
                        validator:validateSlug,
                        unique: true
                    },
                    icon_url: {
                        validator:validateUrl
                    },                    
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        maxRequests: 10,
                        relationalFilters: [],
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields
                        }
                    }
                },
                getFile: {
                    disabled: true,
                    options: {
                        relationalFilters: [],
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
                    disabled: true
                },
                create: {
                    disabled: true,
                    options: {
                        autoGenerateIdFunction: generateId,
                    }
                },
                update: {
                    disabled: true,
                },
                delete: {
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
}
