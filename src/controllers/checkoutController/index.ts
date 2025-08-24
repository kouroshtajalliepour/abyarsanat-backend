import verifyCardItems from "../../useCases/verifyCardItems/index";


export default async function (request:any) {

    const headers = {
        'Content-Type': 'application/json'
    };
    
    try {
        
        const {cartItems} = request.cookies;
        const {
            promotion_code,
            selectedAddress,
            selectedShipment
        } = request.body

        const {
            url,
            newCart
        } = await verifyCardItems({
            author: request.md_data.author,
            promotion_code,
            cartItems: JSON.parse(cartItems),
            config: {
                selectedAddress,
                selectedShipment
            },
            locale: request.locale
        })

        return {
            headers,
            statusCode: 200,
            body: {
                success: true,
                url
            }
        }
        // if (!cartMustUpdate) {
        // }else {
        //     return {
        //         headers,
        //         statusCode: 201,
        //         cookies: [
        //             {
        //                 key: "cartItems",
        //                 value: JSON.stringify(newCart),
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
            // clearCookie: "cartItems",
            // cookies
            body: {
                message: error.message
            }
        }
    }


} 