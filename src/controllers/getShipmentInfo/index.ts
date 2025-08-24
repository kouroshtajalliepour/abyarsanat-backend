import getShipmentInfo from "../../useCases/getShipmentInfo/index";


export default async function (request:any) {

    const headers = {
        'Content-Type': 'application/json'
    };
    
    try {
        
        const {
            provinceId,
            weight,
            totalPrice,
            cityId
        } = request.query

        const {
            shipmentInfo
        }  = await getShipmentInfo({
            provinceId,
            weight,
            totalPrice,
            cityId
        })

        return {
            headers,
            statusCode: 200,
            body: {
                shipmentInfo
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