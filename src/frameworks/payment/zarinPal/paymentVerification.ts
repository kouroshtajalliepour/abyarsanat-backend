import {ZarinPal} from "./zarinpal"

export default async function ({amount, authority_id}: {amount: string, authority_id: string}){
    
    const {
        payment: {
            merchantId,
        }
    } = useRuntimeConfig()

    try {
        const zarinPal = new ZarinPal(merchantId)

        if (!amount) {
            throw new Error("useCases.errors.payment.notVerified")
        }
        return await zarinPal.PaymentVerification({
            amount: Number(amount),
            authority: authority_id
        })

    } catch (error:any) {
        throw new Error("useCases.errors.payment.notVerified")
    }
}