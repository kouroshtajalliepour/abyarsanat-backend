export default (app:IApp) => {

    const {
        userIsAuthenticated,
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
        "payment_id",
        "merchant_id",
        "provider",
        "authority_id",
        "verified",
        "total_amount",
        "cart_items",
        "created_at",
        "status",
        "total_discounted_amount",
        "total_promoted_amount",
        "province_name",
        "city_name",
        "full_address",
        "postal_code",
        "coordinates",
        "building_number",
        "building_unit",
        "recipient_phone_number",
        "recipient_first_name",
        "recipient_last_name",
        "promotion_slug",
        "promotion_discount_price",
        "promotion_discount_percentage",
        // 'name',
        // 'province_name',
        // 'city_name',
        // 'full_address',
        // 'postal_code',
        // 'coordinates',
        // 'user_id',
        // 'building_number',
        // 'building_unit',
        // 'recipient_phone_number', 
        // 'recipient_first_name',
        // 'recipient_last_name',
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
                tableName: 'user_transaction',
                id: {
                    validator: validateULID
                },
                localizedFields: {},
                fields: {
                    user_id: {
                        validator: validateULID,
                        getFromMiddleware: true
                    },
                    status: {
                        validator: validateString,
                    },
                    verified: {
                        type: "boolean"
                    }
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
                    disabled: true,
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
