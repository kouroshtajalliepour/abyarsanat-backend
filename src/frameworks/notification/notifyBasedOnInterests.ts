export default (PushNotifications:any) => {

    return ({
        notification: {
            title,
            message
        },
        interests,
        keys
    }:any) => {

        return new Promise<any>(async(resolve, reject) => {
            
            const beamsClient = new PushNotifications(keys);
              
              
            try {
                await beamsClient.publishToInterests(interests, {
                    apns: {
                        aps: {
                            alert: {
                                title: title,
                                body: message,
                            },
                        },
                    },
                    fcm: {
                        notification: {
                            title: title,
                            body: message,
                        },
                    },
                    web: {
                        notification: {
                            title: title,
                            body: message,
                        },
                    },
                });
                resolve({
                    msg: 'notification sent'
                })
            } catch (error) {
                reject(error)
            }

        })

    }
}
