import getPage from "../../useCases/getPage/index";


export default async function (request:any) {

    const headers = {
        'Content-Type': 'application/json'
    };
    
    try {
        
        const {cartItems:CartItems} = request.cookies;
        const {
            id
        } = request.params

        const {
            page,
            cartItems,
            info
        }  = await getPage({
            id, 
            locale: request.locale, 
            fetchInfo: request.query.fetchInfo == '1' ? true : false, 
            cartItems: CartItems
        })

        return {
            headers,
            statusCode: 200,
            body: {
                page,
                cartItems,
                info
            }
        }

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