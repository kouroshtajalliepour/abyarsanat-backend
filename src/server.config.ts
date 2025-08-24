import {provinces, cities} from "./utils/shipmentInfo"

export default defineServerConfig({
    database: {
        db: "postgres",
        host: process.env.DATABASE_HOST ? process.env.DATABASE_HOST : "localhost",
        port: process.env.DATABASE_PORT ? process.env.DATABASE_PORT : 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
    server: {
        port: Number(process.env.SERVER_PORT),
        baseURL: process.env.SERVER_BASE_URL as string,
        langs: process.env.SERVER_LANGS?.split(',') as any,
        appMiddlewares: {
            tooBusy: true,
            morgan: true,
            hpp: true,
            cookieParser: true,
            parseForm: true,
            setTrustProxy: true,
            cors: {
                origin:process.env.SERVER_ALLOWED_ORIGINS?.split(',') as any,
                optionSuccessStatus:204,
                methods: ['GET, PUT, POST, DELETE, PATCH, OPTIONS'],
                // allowedHeaders: '*',
                credentials: true
            },
        },
        middlewares: {
            rateLimiter: true,
            captcha: {
                secretKey: process.env.CAPTCHA_KEY ? process.env.CAPTCHA_KEY : "6Lc43xEoAAAAAFHM2QrROyJy5x0qdMFDjKJoQfld"
            },
            auth: [
                {
                    name: "adminIsAuthenticated",
                    tableName: "admin",
                    ipValidator: async function (ip){
                    },
                    extraTables: [
                        {
                            displayName: "role_access_level",
                            tableName: "admin_role_access",
                            parentId: "role_id",
                            childId: "role_id",
                            multiOptions: {
                                orderBy: "created_at DESC",
                                limit: 30
                            }
                        },
                    ],
                    tokenTable: "admin_token",
                    makeAuthTokenFunctions : function (){
                        const {
                            secret:{
                                admin: {
                                    authToken
                                }
                            }
                        } = useRuntimeConfig()
                        
                        const {
                            tokenFunctions: {
                                makeAuthorGenerateFunction,
                                makeAuthorValidateFunction
                            }
                        } = useFrameworks()

                        return {
                            generate: makeAuthorGenerateFunction(authToken),
                            extractId: makeAuthorValidateFunction(authToken),
                        }
                    }
                },
                {
                    name: "userIsAuthenticated",
                    tableName: "_user",
                    ipValidator: async function (ip){
                    },
                    extraTables: [
                    ],
                    checkAuthStatusMiddleware: {
                        name: "checkUserAuthStatus",
                        makeRefreshTokenFunctions : function (){
                            const {
                                secret:{
                                    user: {
                                        refreshToken
                                    }
                                }
                            } = useRuntimeConfig()
                            
                            const {
                                tokenFunctions: {
                                    makeAuthorGenerateFunction,
                                    makeAuthorValidateFunction
                                }
                            } = useFrameworks()
    
                            return {
                                generate: makeAuthorGenerateFunction(refreshToken),
                                extractId: makeAuthorValidateFunction(refreshToken),
                            }
                        }
                    },
                    makeAuthTokenFunctions : function (){
                        const {
                            secret:{
                                user: {
                                    authToken
                                }
                            }
                        } = useRuntimeConfig()
                        
                        const {
                            tokenFunctions: {
                                makeAuthorGenerateFunction,
                                makeAuthorValidateFunction
                            }
                        } = useFrameworks()

                        return {
                            generate: makeAuthorGenerateFunction(authToken),
                            extractId: makeAuthorValidateFunction(authToken),
                        }
                    }
                },

            ]
        }

    },
    uploadMethods: {
        signedUrl: {
            accessKeyId: process.env.UPLOAD_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.UPLOAD_SECRET_ACCESS_KEY as string,
            endpoint: process.env.UPLOAD_URL as string,
            Bucket: process.env.UPLOAD_BUCKET as string,
        }
    },

    runtime: {
        domainName: process.env.DOMAIN_NAME,
        uploadCorsOrigin: process.env.UPLOAD_CORS_ORIGIN,
        validCities: cities.map((item:any) => {
            return item.cityId
        }),
        validProvinces: provinces.map((item:any) => {
            return item.provinceId
        }),
        initialAdmins: [
            {
                username: "webclicks",
                hashed_data: process.env.WEBCLICKS_ADMIN_PASSWORD,
                first_name: "webclicks",
                last_name: "developer",
                email: "info@webclicks.ir",
            },
        ],
        shipment: {
            validShipments: [
                "iranPost",
                "chapar",
            ],
            iranPost: {
                sameProvinceBasePrice: 540000,
                neighborProvinceBasePrice: 590000,
                otherProvinceBasePrice: 812000,
                sameProvinceAdditionalWeightPrice: 910000,
                neighborProvinceAdditionalWeightPrice: 105000,
                otherProvinceAdditionalWeightPrice: 128700,
                insurancePrice: 80000,
                productBasePrice: 100000
            },
            chapar: {
                username: "m.home12",
                password: "123456",
                origin: "11339",
                method: "1",
                sender_code: "1",
                receiver_code: "1",
                cod: "0",
                baseAddedPrice: 150000


            }
        },
        accessGroups: [
            'pageManagement',
            'blogManagement',
            'adminManagement',
            'logManagement',
            'fileManagement',
            'userManagement',
            'productManagement',
        ],
        pages: [
            'home',
            'about',
            'blogs',
            'faq',
            'contact'
        ],
        tables: [
            'admin',
            'admin_role',
            'admin_role_localized_info',
            'admin_role_access',
            'blog',
            'blog_localized_info',
            'blog_category',
            'blog_category_localized_info',
            'blog_tag',
            'blog_tag_localized_info',
            'page',
            'page_localized_info',
            'info',
            'info_localized_info',
            'user',
            'user_localized_info'
        ],
        pushNotificationKeys: {
            instanceId: process.env.PUSHER_INSTANCE_ID,
            secretKey: process.env.PUSHER_SECRET_KEY
        },
        sms: {
            apiKey: process.env.SMS_API_KEY,
            number1: process.env.SMS_NUMBER_1,
            number2: process.env.SMS_NUMBER_2,
        },
        payment: {
            merchantId: process.env.PAYMENT_MERCHANT_ID,
            callBackUrl: process.env.PAYMENT_CALL_BACK,
            description: process.env.PAYMENT_DESCRIPTION
        },
        secret: {
            admin: {
                loginToken: process.env.SECRET_ADMIN_LOGIN_TOKEN,
                refreshToken: process.env.SECRET_ADMIN_REFRESH_TOKEN,
                authToken: process.env.SECRET_ADMIN_AUTH_TOKEN,
                resetPasswordToken: process.env.SECRET_ADMIN_RESET_PASSWORD_TOKEN,
                passwordToken: process.env.SECRET_ADMIN_PASSWORD_TOKEN,
            },
            user: {
                loginToken: process.env.SECRET_USER_LOGIN_TOKEN,
                refreshToken: process.env.SECRET_USER_REFRESH_TOKEN,
                authToken: process.env.SECRET_USER_AUTH_TOKEN,
                otpToken: process.env.SECRET_USER_OTP_TOKEN,
            },
        }

    }
})