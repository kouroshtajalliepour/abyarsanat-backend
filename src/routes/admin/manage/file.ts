export default (app:IApp) => {
    const {
        generateId,
        upload: {
            getSignedUrl
        }
    } = useFrameworks()

    const {
        adminIsAuthenticated
    } = useMiddlewares()

    const {
        validateULID,
        validateSlug,
        makeValidateString,
    } = useValidators()

    return useFileRoutes(
        {
            app,
            middleware: [adminIsAuthenticated, adminHasAccessTo],
            allowManagement: true,
            autoGenerateIdFunction: generateId,
            uploadFunction: getSignedUrl,
            // autoGenerateSlug: true,
            validators: {
                idValidator: validateULID,
                slugValidator: validateSlug,
                ownerTableValidator: makeValidateString(),
                ownerIdValidator: validateULID,
            },
            isGlobal: true
        }
    )

    async function adminHasAccessTo(request:any) {
        const admin = request.md_data.author

        if (admin.role_id && request.method.toLowerCase() != "get") {
            const accessGroups = admin.role_access_level.map((al:any) => {
                return al.access_group
            })

            if (!accessGroups.includes('fileManagement')) {
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