const { Client } = require('pg');

  
async function dataTypes(){
    const client = new Client({
        user: 'ubuntu',
        database: 'abyarsanat',
        password: '123',
        port: 5432,
    });
    
    try {
        console.log("changing data types ...")
        await client.connect();
        console.log("db connected")
        await client.query("begin");
        console.log("transaction began")
        // * disabling triggers assigned to all the data
        await client.query(`
            SET LOCAL
                app.no_collection = '${true}'
        `)
        console.log("variable sat")

        // * disabling triggers assigned to all the data

        const {rows:filters} = await client.query("select id, serial_id from product_category_filter");
        for (let i = 0; i < filters.length; i++) {
            const {id,serial_id} = filters[i];
            

            await client.query("UPDATE product_filter SET product_category_filter_serial_id = $1 WHERE product_category_filter_id = $2", [serial_id, id]);
        }

        const {rows:filterValues} = await client.query("select id, serial_id from product_category_filter_value");
        for (let i = 0; i < filterValues.length; i++) {
            const {id,serial_id} = filterValues[i];
            

            await client.query("UPDATE product_filter SET product_category_filter_value_serial_id = $1 WHERE product_category_filter_value_id = $2", [serial_id, id]);
        }
        
        await client.query('commit')
        console.log("transaction committed")
        
        
    } catch (error) {
        console.log("🚀 ~ dataTypes ~ error:", error)
        await client.query('rollback')
        console.log("transaction rolled back")
    }finally{
        await client.end()
    }
}

dataTypes();