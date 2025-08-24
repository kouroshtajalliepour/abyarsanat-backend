import axios from "axios"

const config = {
    merchantIDLength: 36,
    api: {
        PR: "https://api.zarinpal.com/pg/v4/payment/request.json",
        PV: "https://api.zarinpal.com/pg/v4/payment/verify.json",
        CB: "https://www.zarinpal.com/pg/StartPay/"
    },
}

export class ZarinPal{
    merchant?: string;

    constructor(MerchantID:string, sandbox?:boolean) {
        if(typeof MerchantID !== 'string'){
            throw new Error("MerchantId is invalid");
        }
        if (MerchantID.length === config.merchantIDLength) {
            this.merchant = MerchantID;
        } else {
            throw new Error("MerchantId is invalid");
        }
    }


    async PaymentRequest ({
        amount,
        callback_url,
        description,
        email,
        mobile,
    }:{
        amount: number,
        callback_url: string,
        description: string,
        email?: string,
        mobile?: string,
        
    } = {
        amount: 1,
        callback_url: '1',
        description: 'description'
    }) {
    
        const body = {
            merchant_id: this.merchant,
            amount,
            callback_url,
            description,
            metadata: {
                email,
                mobile
            }
        };

        try {
            const {data:{data}} = await axios.post(config.api.PR, body)

            const {
                code,
                authority,
            } = data

            if (code != 100) {
                throw {
                    status: 500
                }
            }

            return{
                status: code,
                authority: authority,
                url: `${config.api.CB}${authority}`
            }
        } catch (error:any) {
            throw {
                status: 500
            }
        }
    }

    async PaymentVerification ({
        amount,
        authority
    }:{
        amount: number,
        authority: string
    } = {
        amount: 1,
        authority: '1'
    }) {
        const self = this;
        const body = {
            merchant_id: this.merchant,
            amount,
            authority
        };
    
        try {
            const {data:{data}} = await axios.post(config.api.PV, body)

            const {
                code,
                ref_id,
            } = data
        
            if (code != 100 && code != 101) {
                throw {
                    status: 500
                }
            }

            return{
                status: code,
                ref_id,
            }
        } catch (error:any) {
            throw {
                status: 500
            }
        }
    
    };
}