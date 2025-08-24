import getUserTransaction from "../../dataAccess/userTransaction"


export default async function (config:any){

    const {
        sendSms
    } = useFrameworks()

    try {

        const {user,config:Config} = await getUserTransaction(config)

        await sendSms.transactionNotification({
            phoneNumber: user.phone_number,
            name: user.first_name,
            payment_id: user.payment_id,
            cart_number: config.new.status === 'in-process' && config.new.cart_number ? config.new.cart_number : undefined,
            status: user.status,
            shipment_id: user.shipment_id
        })
    

    } catch (error:any) {
        throw error
    }
}