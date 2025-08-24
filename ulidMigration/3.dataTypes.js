const { Client } = require('pg');
const { ulid } = require('ulid'); 

const tables = [
    // * user
    {
        name: "product_product",
        idField: "id",
    },
]
  
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

        for (let i = 0; i < tables.length; i++) {
            const {
                name,
                idField,
                relations
            } = tables[i];


            if (relations?.length) {
                for (let i = 0; i < relations.length; i++) {
                    const {
                        tableName,
                        relField
                    } = relations[i];

                    await client.query(`
                        ALTER TABLE ${tableName} ALTER COLUMN ${relField} TYPE varchar(36);
                    `);
                    console.log(`table ${tableName} identifier field max chars changed to 36`)
                }
            }
            
            await client.query(`
                ALTER TABLE ${name} ALTER COLUMN ${idField} TYPE varchar(36);
            `)
            await client.query(`
                ALTER TABLE ${name} ADD CONSTRAINT ${name}_pkey PRIMARY KEY (id);
            `)
            console.log(`table ${name} pkey added`)
            
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