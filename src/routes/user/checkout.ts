export default (app:IApp) => {

    const {
        userIsAuthenticated
    } = useMiddlewares();

    const {
        checkoutController,
        getShipmentInfo
    } = useControllers()
    
    return createRoutes({
        app,
        middleware: [userIsAuthenticated],
        routes: [
            {
                method: "post",
                url: "/",
                controller: checkoutController,
                options: {
                    rateLimit: {
                        at: 3000,
                        max: 2
                    }
                }
            },
            {
                method: "get",
                url: "/shipment-info",
                controller: getShipmentInfo,
                options: {
                    rateLimit: {
                        at: 3000,
                        max: 2
                    }
                }
            },
        ]

    })

}
