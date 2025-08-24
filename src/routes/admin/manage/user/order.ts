import sendNotification from "../../../../useCases/sendNotification"
export default (app:IApp) => {

    const {
        adminIsAuthenticated,
    } = useMiddlewares();

    const {
        makeValidatePassword,
        makeValidateString,
        makeValidateUrl,
        validateULID,
        validateIranianPhoneNumber,
        validateDescription,
        validateEmail,
        validateNumber

    } = useValidators()

    const {
        generateId,
    } = useFrameworks()

    const {pages} = useRuntimeConfig()
    const validateString = makeValidateString()
    const validateStatus = makeValidateString(["completed", "in-process", "canceled", "packed"])

    const visibleFields = [
        "id",
        "description",
        "payment_id",
        "shipment_id",
        "total_weight",
        "shipment_method",
        "shipment_cost",
        "total_payed_amount",
        "payed_shipment_cost",
        "merchant_id",
        "ref_id",
        "provider",
        "authority_id",
        "verified",
        "total_amount",
        "cart_items",
        "cart_number",
        "status",
        "user_id",
        "province_name",
        "city_name",
        "full_address",
        "postal_code",
        "total_discounted_amount",
        "total_promoted_amount",
        "promotion_slug",
        "promotion_discount_percentage",
        "promotion_discount_price",
        "coordinates",
        "building_number",
        "building_unit",
        "recipient_phone_number",
        "recipient_first_name",
        "recipient_last_name",
        "created_at",
        "last_modified_at",
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
                tableName: 'user_transaction',
                id: {
                    validator: validateULID
                },                
                localizedFields: {},
                fields: {
                    status: {
                        validator: validateStatus,
                    },
                    shipment_id: {
                        validator: validateString,
                    },
                    ref_id: {
                        validator: validateString,
                    },
                    cart_number: {
                        validator: validateString,
                    },
                    description: {
                        validator: validateDescription,
                    },
                    shipment_cost: {
                        validator: validateNumber,
                    },
                    city_name: {
                        validator: validateString,
                    },
                    province_name: {
                        validator: validateString,
                    },
                    postal_code: {
                        validator: validateString,
                    },
                    building_unit: {
                        validator: validateString,
                    },
                    building_number: {
                        validator: validateString,
                    },
                    full_address: {
                        validator: validateDescription,
                    },
                    recipient_phone_number: {
                        validator: validateIranianPhoneNumber,
                    },
                    recipient_first_name: {
                        validator: validateString,
                    },
                    recipient_last_name: {
                        validator: validateString,
                    },
                    verified: {
                        type: 'boolean',
                        allowedToBeNull: true
                    },
                    user_id: {
                        validator: validateULID
                    },
                    payment_id: {
                        validator: validateNumber,
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
                    disabled: true,
                    options: {
                        autoGenerateIdFunction: generateId,
                    }
                },
                update: {
                    disabled: false,
                    options: {
                        notify: async(config:any)=> {
                            await sendNotification(config)
                        },
                    }
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
