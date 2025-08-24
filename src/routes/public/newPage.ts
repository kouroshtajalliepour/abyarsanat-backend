export default (app:IApp) => {

    const {
        getPage
    } = useControllers()
    
    return createRoutes({
        app,
        middleware: [],
        routes: [
            {
                method: "get",
                url: "/:id",
                controller: getPage,
                options: {
                    rateLimit: {
                        at: 5000,
                        max: 20
                    }
                }
            }
        ]

    })

}