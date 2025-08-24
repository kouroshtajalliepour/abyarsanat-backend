export default (app:IApp) => {

    const {
        userIsAuthenticated,
    } = useMiddlewares();

    const {
        validateDescription,
        makeValidateString,
        validateULID,
        validateIranianPhoneNumber,

    } = useValidators()

    const {
        generateId
    } = useFrameworks()

    const {
        validCities,
        validProvinces
    } = useRuntimeConfig()

    const validateProvinceId = makeValidateString(validProvinces)
    const validateCityId = makeValidateString(validCities)
    const validateString = makeValidateString()

    const visibleFields = [
        'id',
        'name',
        'province_name',
        'city_name',
        'province_id',
        'city_id',
        'full_address',
        'postal_code',
        'coordinates',
        'user_id',
        'created_at',
        'building_number',
        'building_unit',
        'recipient_phone_number', 
        'recipient_first_name',
        'recipient_last_name',
        'last_modified_at',
    ]

    return useRoutes(
        {
            app,
            middleware: [userIsAuthenticated, userIsThemSelves],
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
                        validator: validateULID,
                        getFromMiddleware: true
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

    async function userIsThemSelves(request:any) {
        const user = request.md_data.author

        
        return {
            statusCode: 200,
            body: {
                user_id: user.id
            }
        }
    }
}
