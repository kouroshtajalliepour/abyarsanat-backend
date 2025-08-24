import generateId from "../../../frameworks/generateId"
import {ZarinPal} from "./zarinpal"

export default async function ({amount}: {amount:string}){


    const {
        domainName,
        payment: {
            merchantId,
            callBackUrl,
            description
        }
    } = useRuntimeConfig()

    
    if (!amount) {
        const id = generateId()
        const url = `${process.env.DOMAIN_NAME}/payment/call-back?status=OK&authority=${id}`
        
        return {
            merchant_id: 'none',
            authority_id: id,
            payment_url: url
        }
    }

    try {

        const zarinPal = new ZarinPal(merchantId)
    
        const {
            status,
            authority,
            url,
        } =  await zarinPal.PaymentRequest({
            amount: Number(amount),
            callback_url: `${domainName}${callBackUrl}`,
            description
        }) as any

        return {
            merchant_id: merchantId,
            authority_id: authority,
            payment_url: url,
        }


    } catch (error:any) {
        logger.error(error)
        throw new Error("useCases.errors.payment.paymentNotAvailable")
    }



    
}