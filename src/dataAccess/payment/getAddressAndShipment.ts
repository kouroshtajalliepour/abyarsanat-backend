import { Client } from 'pg'

export default async function ({
    selectedAddress,
    totalWeight,
    selectedShipment,
    total_promoted_amount,
    shipmentFunction
}: any){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        await client.connect()
        
        const {rows:addressesFound} = await client.query("SELECT ua.*, u.first_name as user_first_name, u.last_name as user_last_name, u.phone_number as user_phone_number FROM user_address ua LEFT JOIN _user u ON u.id = ua.user_id WHERE ua.id = $1", [
            selectedAddress
        ])

        if (!addressesFound[0].id) {
            throw {
                status: 404
            }
            
        }

         
        const shipmentInfo = await shipmentFunction({
            provinceId: addressesFound[0].province_id,
            weight: totalWeight,
            cityId: addressesFound[0].city_id,
            totalPrice: Number(total_promoted_amount)

        })

        if (shipmentInfo[selectedShipment] != 0 && !shipmentInfo[selectedShipment]) {
            throw new Error("useCases.errors.general.shipmentUnavailable");
        }


        return {
            fetchedAddress: addressesFound[0],
            shipmentInfo: {
                method: selectedShipment,
                price: shipmentInfo[selectedShipment]
            },
            total_payed_amount:  Number(total_promoted_amount) + Number(shipmentInfo[selectedShipment])
        }
        

       
    } catch (error:any) {
        logger.error(error)
        throw new Error("useCases.errors.general.unExpected");
    }finally {
        await client.end()
    }
        
}