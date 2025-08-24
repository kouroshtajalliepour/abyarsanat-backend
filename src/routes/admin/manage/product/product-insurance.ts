export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateDescription,
        validateSlug,
        makeValidateHTML,
        validatePercentage
    } = useValidators()

    const {
        generateId,
        validateHTML: html
    } = useFrameworks()

    const validateString = makeValidateString()
    const validateUrl = makeValidateUrl(false)
    const validateHTML = makeValidateHTML(html)

    const visibleFields = [
        'id',
        'slug',
        'icon_url',
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
                serverJsonSizeLimit: "1mb",
                serverUrlEncodedSizeLimit: "1mb"
                // useCaptcha: true,
            },
            db: {
                tableName: 'product_insurance',
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
                    content: {
                        validator: validateHTML,
                        allowedToBeNull: true
                    },
                },
                fields: {
                    slug: {
                        validator:validateSlug,
                        unique: true
                    },
                    percentage: {
                        validator:validatePercentage
                    },
                    discounted_percentage: {
                        validator:validatePercentage,
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
                        relationalFilters: [
                            {
                                tableName: "product_available_insurance",
                                fields: {
                                    insurance_not_included_in_product: {
                                        validator:validateULID,
                                        target: "product_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_insurance_id",
                            }
                        ],
                        visibleFields: {
                            basic: visibleFields,
                            localized: visibleLocalizedFields
                        }
                    }
                },
                getFile: {
                    disabled: false,
                    options: {
                        relationalFilters: [
                            {
                                tableName: "product_available_insurance",
                                fields: {
                                    insurance_not_included_in_product: {
                                        validator:validateULID,
                                        target: "product_id",
                                        filterType: "!exists"
                                    }
                                },
                                parentId: "id",
                                childId: "product_insurance_id",
                            }
                        ],
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
