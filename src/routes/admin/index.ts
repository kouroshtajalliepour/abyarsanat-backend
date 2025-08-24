export default (app:IApp) => {
    
    const {
        
        encryption,
        generateId,
        tokenFunctions
        
    } = useFrameworks();

    const {
        secret:{
            admin: {
                loginToken,
                refreshToken,
                authToken,
                passwordToken, 
                resetPasswordToken
            }
        },
        initialAdmins
    } = useRuntimeConfig()

    const {
        captchaValidator,
        adminIsAuthenticated
    } = useMiddlewares();

    const {
        validateEmail,
        makeValidateString,
        makeValidatePassword,
        makeValidateUrl
    } = useValidators()

    const validateString = makeValidateString()
    const validateUrl = makeValidateUrl(false)
    const validatePassword = makeValidatePassword(['lowercase', 'uppercase', 'number', 'symbol'])
    
    
    return useAuthRoutes({
        app,
        initials: initialAdmins,
        db: {
            tableName: "admin",
            passwordField: {
                validator: validatePassword,
                compare: validateAdminPassword,
            },
            identifierFields:{
                email: {validator:validateEmail},
                username: {validator:validateString}
            },
            signupFields: {
                username: {
                    validator:validateString
                },
                first_name: {
                    validator:validateString
                },
                last_name: {
                    validator:validateString
                },
                email: {
                    validator:validateEmail,
                },
                hashed_data: {
                    validator: validatePassword,
                    constructor: generateAdminPassword
                },
            },
            editableFields: {
                username: {
                    validator:validateString
                },
                first_name: {
                    validator:validateString
                },
                last_name: {
                    validator:validateString
                },
                email: {
                    validator:validateEmail,
                },
                image_url: {
                    validator:validateUrl,
                },
                hashed_data: {
                    validator: validatePassword,
                    constructor: generateAdminPassword
                },
            },
        },
        options: {
            tokenTable: "admin_token",
            captchaMiddleware: captchaValidator,
            autoGenerateIdFunction: generateId,
            authMiddleware: adminIsAuthenticated,
            allowSignup: false,
        },
        tokens: {
            login: {
                generate: tokenFunctions.makeAuthorGenerateFunction(loginToken),
                extractId: tokenFunctions.makeAuthorValidateFunction(loginToken),
            },
            refresh: {
                generate: tokenFunctions.makeAuthorGenerateFunction(refreshToken),
                extractId: tokenFunctions.makeAuthorValidateFunction(refreshToken),
            },
            auth: {
                generate: tokenFunctions.makeAuthorGenerateFunction(authToken),
                extractId: tokenFunctions.makeAuthorValidateFunction(authToken),
            }
        },
        
    })

    // * password validation
    
    async function validateAdminPassword(
        {
            author: {
                hashed_data,
                id
            },
            password
        }:any
    )  {
        const key = encryption.convertPasswordToBase32(
            passwordToken, 
            password
        )
        const valid = await encryption.decrypt(hashed_data, key, id);
    
        if (!valid) {
            throw 403
        }
    }
    async function generateAdminPassword(password:string, id:string)  {
        const key :any= encryption.convertPasswordToBase32(
            passwordToken,
            password
        )
        return await encryption.encrypt(id, key) as any;
    }
}
