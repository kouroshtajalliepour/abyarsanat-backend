import verifyTransaction from "../../dataAccess/payment/verifyTransaction"

export default async function (authority_id:string, locale:string){

    const {
        payment: {
            zarinPal: {
                paymentVerification,
            },
        },
    } = useFrameworks()

    try {

        return await verifyTransaction({authority_id, paymentVerification, locale});

    } catch (error:any) {
        throw error
    }
}