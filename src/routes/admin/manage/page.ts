export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        validateDescription,
        makeValidateString,
        makeValidateUrl
    } = useValidators()

    const {pages} = useRuntimeConfig()
    const validatePage = makeValidateString(pages)
    const validateString = makeValidateString()
    const validateUrl = makeValidateUrl(false)


    return useRoutes(
        {
            app,
            middleware: [adminIsAuthenticated,adminHasAccessTo],
            options: {
                // collectView: true,
                collectLog: true,
                // useCaptcha: true,
            },
            db: {
                tableName: 'page',
                id: {
                    validator: validatePage
                },
                localizedFields: {
                    title: {
                        validator: validateString,
                    },
                    tags: {
                        validator:validateString,
                    },
                    image_url: {
                        validator: validateUrl,
                    },
                    description: {
                        validator: validateDescription,
                    },
                },
                fields: {},
            },
            routes: {
                get: {
                    disabled: true,
                },
                getFile: {
                    disabled: true
                },
                getOne: {
                    disabled: false,
                    options: {
                        localize: true,
                        id: {
                            validator: validatePage,
                            name: 'id'
                        },
                        extraTables: [
                            {
                                displayName: "slides",
                                tableName: "page_slide",
                                parentId: "id",
                                childId: "page_id",
                                passLocale: true,
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                            {
                                displayName: "banners",
                                tableName: "page_banner",
                                parentId: "id",
                                childId: "page_id",
                                passLocale: true,
                                multiOptions: {
                                    orderBy: "index_number ASC",
                                    limit: 20
                                }
                            },
                        ],
                    }
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
                    disabled: false
                },
                updateLocale: {
                    disabled: false
                },
                deleteLocale: {
                    disabled: false
                },
                getLocale: {
                    disabled: false
                },
                getLocales: {
                    disabled: false,
                    options: {
                        id: {
                            validator: validatePage
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

            if (!accessGroups.includes('pageManagement')) {
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
