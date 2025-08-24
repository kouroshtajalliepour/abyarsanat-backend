const { Client } = require('pg');
const { ulid } = require('ulid'); 
  
async function changeId(){
    // const client = new Client({
    //     user: 'ubuntu',
    //     database: 'abyarsanat',
    //     password: '123',
    //     port: 5432,
    // });
    
    const client = new Client({
        user: 'kouroshtajalliepour',
        database: 'test_ulid',
        password: '13736777kt7',
        port: 5432,
    });
    
    try {
        console.log("changing id ...")
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

        const {rows:filters} = await client.query("select id, serial_id from product_category_filter");
        const {rows:values} = await client.query("select id, serial_id from product_category_filter_value");


        for (let i = 0; i < filters.length; i++) {
            const {
                serial_id,
                id
            } = filters[i];

            await client.query("UPDATE product_filter SET product_category_filter_serial_id = $1 WHERE product_category_filter_id = $2", [
                serial_id,
                id,
            ])
            
        }
        for (let i = 0; i < values.length; i++) {
            const {
                serial_id,
                id
            } = values[i];

            await client.query("UPDATE product_filter SET product_category_filter_value_serial_id = $1 WHERE product_category_filter_value_id = $2", [
                serial_id,
                id,
            ])
            
        }
       
        await client.query('commit')
        console.log("transaction committed")
        
        
    } catch (error) {
        console.log("🚀 ~ changeId ~ error:", error)
        await client.query('rollback')
        console.log("transaction rolled back")
    }finally{
        await client.end()
    }
}

changeId();