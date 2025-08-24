export default (app:IApp) => {

    const {
        makeValidateString,
        validateULID,
        validatePercentage,
        validateSlug,
        validateNumber

    } = useValidators()

    const {
        generateId
    } = useFrameworks()

    const {pages} = useRuntimeConfig()
    const validateString = makeValidateString()

    const visibleFields = [
        "id",
        "max_applicable_price",
        "slug",
        "min_applicable_price",
        "max_use",
        "times_used",
        "discount_price",
        "discount_percentage",
        "created_at",
        "last_modified_at",
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
                tableName: 'promotion',
                id: {
                    validator: validateULID
                },
                localizedFields: {},
                fields: {
                    slug: {
                        validator: validateSlug,
                        unique: true
                    },
                    max_applicable_price: {
                        validator: validateNumber,
                    },
                    min_applicable_price: {
                        validator: validateNumber,
                    },
                    max_use: {
                        validator: validateNumber,
                    },
                    times_used: {
                        validator: validateNumber,
                        allowedToBeNull: true
                    },
                    discount_price: {
                        validator: validateNumber,
                        allowedToBeNull: true
                    },
                    discount_percentage: {
                        validator: validatePercentage,
                        allowedToBeNull: true
                    },
                },
            },
            routes: {
                get: {
                    disabled: true,
                    options: {
                        relationalFilters: [],
                        visibleFields: {
                            basic: visibleFields,
                        },
                    }
                },
                getFile: {
                    disabled: true,
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
                            name: "slug",
                            validator: validateSlug
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
}
