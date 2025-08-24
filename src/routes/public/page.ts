export default (app:IApp) => {

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
            middleware: [],
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
                    options: {
                        id: {
                            validator: validatePage
                        }
                    }
                },
            },

        }
    )
}
