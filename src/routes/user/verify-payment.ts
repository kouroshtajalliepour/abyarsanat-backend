export default (app:IApp) => {

    const {
        userIsAuthenticated
    } = useMiddlewares();

    const {
        verifyPaymentController
    } = useControllers()
    
    return createRoutes({
        app,
        middleware: [userIsAuthenticated],
        routes: [
            {
                method: "put",
                url: "/:id",
                controller: verifyPaymentController,
                options: {
                    rateLimit: {
                        at: 5000,
                        max: 2
                    }
                }
            }
        ]

    })

}
