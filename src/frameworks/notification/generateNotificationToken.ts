export default (PushNotifications:any) => {

    return ({
        id,
        keys
    }:any) => {

        return new Promise<any>(async(resolve, reject) => {
            
            const beamsClient = new PushNotifications(keys);
              
            try {
                const beamsToken = await beamsClient.generateToken(id);
                resolve(JSON.stringify(beamsToken))
            } catch (error) {
                reject(error)
            }

        });

    }

}