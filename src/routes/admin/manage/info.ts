export default (app:IApp) => {
    const {
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        validateDescription,
        makeValidateString,
        makeValidateUrl,
        makeValidateHTML,
        validateEmail
    } = useValidators()
    const {
        validateHTML: html
    } = useFrameworks()

    const validateString = makeValidateString()

    const validateUrl = makeValidateUrl(false)
    const validateUrlRel = makeValidateUrl(true)
    const validateHtml = makeValidateHTML(html)


    return useRoutes(
        {
            app,
            middleware: [adminIsAuthenticated,adminHasAccessTo],
            options: {
                // collectView: true,
                collectLog: true,
                serverJsonSizeLimit: "1mb",
                serverUrlEncodedSizeLimit: "1mb",
                // useCaptcha: true,
            },
            db: {
                tableName: 'info',
                id: {
                    validator: function (value: string | number){
                        if (value != 1) {
                            throw new Error("useCases.errors.general.infoIdNotOne")
                        }
                        return value
                    }
                },
                localizedFields: {
                    about_content: {
                        validator: validateHtml,
                        allowedToBeNull: true
                    },
                    about_primary_image_url: {
                        validator: validateUrl,
                        allowedToBeNull: true
                    },
                    about_secondary_image_url: {
                        validator: validateUrl,
                        allowedToBeNull: true
                    },
                    main_banner_image_url:{
                        validator: validateUrl,
                        allowedToBeNull: true
                    },
                    main_banner_url:{
                        validator: validateUrlRel,
                        allowedToBeNull: true,
                        updateToNullOnFalsy: true
                    },
                    shipment_description: {
                        validator: validateDescription,
                    },
                    contact_number: {
                        validator: validateString,
                        allowedToBeNull: true
                    },
                    instagram: {
                        validator: validateUrl,
                        allowedToBeNull: true
                    },
                    telegram: {
                        validator: validateUrl,
                        allowedToBeNull: true
                    },
                    tweeter: {
                        validator: validateString,
                        allowedToBeNull: true
                    },
                    whats_app: {
                        validator: validateString,
                        allowedToBeNull: true
                    },
                    sale_number: {
                        validator: validateString,
                        allowedToBeNull: true
                    },
                    support_number: {
                        validator: validateString,
                        allowedToBeNull: true
                    },
                    working_hour: {
                        validator: validateString,
                        allowedToBeNull: true
                    },
                    email: {
                        validator: validateEmail,
                        allowedToBeNull: true
                    },
                    postal_code: {
                        validator: validateString,
                        allowedToBeNull: true
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
                            validator: function (value: string | number){
                                if (value != 1) {
                                    throw new Error("useCases.errors.general.infoIdNotOne")
                                }
                                return value
                            }
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
