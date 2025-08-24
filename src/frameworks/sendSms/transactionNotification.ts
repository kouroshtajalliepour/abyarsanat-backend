import { KavenegarApi } from "kavenegar"
export default async ({
    name,
    phoneNumber,
    payment_id,
    ref_id,
    status,
    cart_number,
    shipment_id
}:any = {}) => {

    if(status === "packed") return;


    const {
        sms: {
            apiKey,
            number1,
            number2,
        }
    } = useRuntimeConfig()

    // let msg = `${name} عزیز، کاربر بوکر\n`


    // switch (status) {
    //     case "submitted":
    //         msg += `سفارش شما با شناسه سفارش ${payment_id} و کد رهگیری ${ref_id} ثبت شد\n`
    //         msg += `در صورت وجود محصولات با قیمت متغیر (سفارشی) در سبد خرید شما جهت پرداخت و نهایی سازی سفارش با شما تماس خواهیم گرفت`
    //         break;
    //     case "completed":
    //         msg += `سفارش شما با شناسه سفارش ${payment_id} ارسال شد.\n`
    //         msg += `شناسه ارسال شما : ${shipment_id}`
    //         break;
    //     case "in-process":
    //         msg += `سفارش شما با شناسه سفارش ${payment_id} در دست انجام قرار گرفت`
    //         break;
    //     case "canceled":
    //         msg += `سفارش شما با شناسه سفارش ${payment_id} لغو شد.\n`
    //         msg += `برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.`
    //         break;
    
    //     default:
    //         break;
    // }

    // const api = KavenegarApi({apikey:apiKey});
    // const body = { message: msg, receptor: phoneNumber }
    // let res : any
    // api.Send(body, (apiResult) => {
    //     res = apiResult
    // });

    const api = KavenegarApi({apikey:apiKey});
    const body = {
        token: name,
        token2: payment_id,
        receptor: phoneNumber
    } as any


    if (cart_number) {
        body.template = "waitingForPayment"
        body.token3 = cart_number
    }else {
        switch (status) {
            case "submitted":
                body.template = 'submitTransaction'
                body.token3 = ref_id
                break;
            case "completed":
                body.template = 'completeTransaction'
                body.token3 = shipment_id
                break;
            case "in-process":
                body.template = 'inProcessTransaction'
                break;
            case "canceled":
                body.template = 'cancelTransaction'
                break;
        
            default:
                break;
        }
    }


    
    let res : any


    api.VerifyLookup(body, (apiResult) => {
        res = apiResult
    })

    if (status === "submitted") {
        const body2 = {
            token: payment_id,
            token2: ref_id,
            receptor: "+989108652540",
            template: "notify"
        } as any

        api.VerifyLookup(body2, (apiResult) => {
            res = apiResult
        })
    }

    if (!res) {
        // throw new Error("useCases.errors.general.serviceNotAvailable");
    }

}