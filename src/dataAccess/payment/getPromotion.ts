import { Client } from 'pg'

export default async function ({
    slug
}: any){
    const databaseInfo = useDatabaseConfig()
    const client = new Client(databaseInfo)
    try {
        await client.connect()
        
        const {rows: result} = await client.query("select * from promotion where slug = $1", [
            slug
        ])
        return result[0]
       
    } catch (error:any) {
        logger.error(error)
        throw new Error("useCases.errors.general.unExpected");
    }finally {
        await client.end()
    }
        
}