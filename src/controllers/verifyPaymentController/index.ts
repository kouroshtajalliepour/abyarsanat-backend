import verifyPayment from "../../useCases/verifyPayment/index";
export default async function (request:any) {

    const headers = {
        'Content-Type': 'application/json'
    };

    
    
    try {
        
        const {
            id
        } = request.params

        if(!id || typeof id !== 'string'){
            throw new Error("useCases.errors.general.unExpected");
        }

        const result = await verifyPayment(id, request.locale)

        

        return {
            headers,
            clearCookie: "cartItems",
            statusCode: 200,
            body: result
        }
        // if (!result.cartMustUpdate) {
        // }else {
        //     return {
        //         headers,
        //         statusCode: 201,
        //         cookies: [
        //             {
        //                 key: "cartItems",
        //                 value: JSON.stringify(result.newCart),
        //                 options: {
        //                     SameSite:"None",
        //                     secure: false
        //                 }
        //             }
        //         ],
        //         body: {
        //             success: false,
        //         }
        //     }
        // }
    } catch (error:any) {
        

        return {
            headers,
            statusCode: 400,
            body: {
                message: error.message
            }
        }
    }


} 