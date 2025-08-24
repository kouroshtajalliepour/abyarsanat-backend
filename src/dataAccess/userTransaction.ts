import { Client } from 'pg'

export default async function getMenu (config:any){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        await client.connect()

        const {rows: user} =  await client.query("select u.phone_number, u.first_name, t.shipment_id, t.status, t.payment_id from user_transaction t left join _user u on u.id = t.user_id where t.id = $1", [config.id])

        return {
            config,
            user:user[0]
        }

    } catch (error:any) {
        throw new Error("useCases.errors.general.unExpected");
    }finally {
        await client.end()
    }
}