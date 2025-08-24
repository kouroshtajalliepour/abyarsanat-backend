export default (app:IApp) => {

    const {
        adminIsAuthenticated,
    } = useMiddlewares();

    const {
        validateDescription,
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateIranianPhoneNumber,
        validateEmail

    } = useValidators()

    const {
        generateId
    } = useFrameworks()

    const {pages} = useRuntimeConfig()
    const validateString = makeValidateString()

    const visibleFields = [
        'id',
        'name',
        'province_name',
        'city_name',
        'full_address',
        'postal_code',
        'coordinates',
        'user_id',
        'created_at',
        "building_number",
        "building_unit",
        "recipient_phone_number",
        "recipient_first_name",
        "recipient_last_name",
        'last_modified_at',
    ]
    const {
        validCities,
        validProvinces
    } = useRuntimeConfig()

    const validateProvinceId = makeValidateString(validProvinces)
    const validateCityId = makeValidateString(validCities)


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
                tableName: 'user_address',
                id: {
                    validator: validateULID
                },
                localizedFields: {},
                fields: {
                    user_id: {
                        validator: validateULID
                    },
                    name: {
                        validator:validateString,
                    },
                    postal_code: {
                        validator:validateString
                    },
                    city_name: {
                        validator:validateString
                    },
                    province_name: {
                        validator:validateString
                    },
                    city_id: {
                        validator:validateCityId
                    },
                    province_id: {
                        validator:validateProvinceId
                    },
                    full_address: {
                        validator:validateDescription
                    },
                    building_number: {
                        validator:validateString,
                        allowedToBeNull: true,
                    },
                    building_unit: {
                        validator:validateString,
                        allowedToBeNull: true
                    },
                    recipient_phone_number: {
                        validator:validateIranianPhoneNumber,
                    },
                    recipient_first_name: {
                        validator:validateString,
                    },
                    recipient_last_name: {
                        validator:validateString,
                    },
                    coordinates: {
                        validator:validateString,
                        allowedToBeNull: true
                    },
                },
            },
            routes: {
                get: {
                    disabled: false,
                    options: {
                        relationalFilters: [],
                        visibleFields: {
                            basic: visibleFields,
                        },
                    }
                },
                getFile: {
                    disabled: false,
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
                            validator: validateULID
                        }
                    }
                },
                checkUniqueness: {
                    disabled: true
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

    async function adminHasAccessTo(request:any) {
        const admin = request.md_data.author

        if (admin.role_id) {
            const accessGroups = admin.role_access_level.map((al:any) => {
                return al.access_group
            })

            if (!accessGroups.includes('userManagement')) {
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
