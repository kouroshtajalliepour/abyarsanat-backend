export default (app:IApp) => {
    
    const {
        
        encryption,
        generateId,
        tokenFunctions
        
    } = useFrameworks();

    const {
        secret:{
            user: {
                loginToken,
                refreshToken,
                authToken,
                otpToken: otpTokenSecret,
            }
        },
    } = useRuntimeConfig()

    const {
        userIsAuthenticated
    } = useMiddlewares();

    const {
        validateEmail,
        makeValidateString,
        validateIranianPhoneNumber
    } = useValidators()

    const {
        sendSms
    } = useFrameworks()

    const validateString = makeValidateString()
    
    
    return useAuthRoutes({
        app,
        db: {
            tableName: "_user",
            identifierFields:{
                phone_number: {validator:validateIranianPhoneNumber},
            },
            signupFields: {
                phone_number: {
                    validator:validateIranianPhoneNumber
                },
            },
            editableFields: {
                phone_number: {
                    validator:validateIranianPhoneNumber
                },
                first_name: {
                    validator:validateString
                },
                last_name: {
                    validator:validateString
                },
                email: {
                    validator:validateEmail,
                    allowedToBeNull: true
                },
            },
        },
        options: {
            // tokenTable: "user_token",
            // captchaMiddleware: captchaValidator,
            authFunction,
            allowedAuthenticateTypes: [
                'askForOtp',
                'validateOtp'
            ],
            autoGenerateIdFunction: generateId,
            authMiddleware: userIsAuthenticated,
            allowSignup: true,
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

    async function authFunction ({
        author,
        type,
        tokens,
        otp
    }:any){
        switch (type) {
            case 'askForOtp':
                const generatedOtp = Math.floor(100000 + Math.random() * 900000)
                await sendSms.otpAuth({name: author.first_name, phoneNumber: author.phone_number, otp: generatedOtp})
                const otpToken = await tokenFunctions.generate({
                    payload: {
                        id: author.id
                    },
                    key: otpTokenSecret,
                    expireTime: 120
                });
                return {
                    tokens: {
                        otpToken
                    },
                    newFields: {
                        otp: generatedOtp
                    }
                }
                
                break;
        
            case 'validateOtp':
                if (!tokens.otpToken) {
                    throw new Error("useCases.errors.general.invalidToken")
                }
                
                const tokenIsValid = await tokenFunctions.validate({
                    token: tokens.otpToken,
                    key: otpTokenSecret,
                })
                
                if (!tokenIsValid) {
                    throw new Error("useCases.errors.general.timeout")
                }

                if(author.otp != otp ){
                    throw 403
                }
                break;
        
            default:
                throw new Error("useCases.errors.general.invalidAuthType")
                break;
        }
    }
}
