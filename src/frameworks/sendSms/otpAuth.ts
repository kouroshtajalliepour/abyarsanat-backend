import { KavenegarApi } from "kavenegar"
export default async ({
    name,
    phoneNumber,
    otp
}:any = {}) => {


    const {
        sms: {
            apiKey,
            number1,
            number2,
        }
    } = useRuntimeConfig()

    const api = KavenegarApi({apikey:apiKey});

    const body = {
        template: 'verify',
        token: name ? name : 'کاربر',
        token2: otp,
        receptor: phoneNumber
    }
    let res : any
    

    api.VerifyLookup(body, (apiResult) => {
        res = apiResult
    })

    if (!res) {

        // const msg = `درود ${name} عزیز کد ورود شما به بوکر : ${otp}`
        // api.Send({ message: msg, receptor: phoneNumber },(apiResult) => {
        //     res = apiResult
        // })
        // throw new Error("useCases.errors.general.serviceNotAvailable");
    }


}