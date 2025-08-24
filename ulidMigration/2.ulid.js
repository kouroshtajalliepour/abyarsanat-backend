const { Client } = require('pg');
const { ulid } = require('ulid'); 

const tables = [
    // * user
    {
        name: "product_product",
        idField: "id",
    },
]
  
async function migrateToULID(){
    const client = new Client({
        user: 'ubuntu',
        database: 'abyarsanat',
        password: '123',
        port: 5432,
    });
    
    try {
        console.log("Migrating to ULID ...")
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

        for (let i = 0; i < tables.length; i++) {
            const {
                name,
                idField,
                relations
            } = tables[i];

            // * changing datatype

            if (relations?.length) {
                for (let i = 0; i < relations.length; i++) {
                    const {
                        tableName,
                        relField
                    } = relations[i];

                    await client.query(`
                        ALTER TABLE ${tableName} ALTER COLUMN ${relField} TYPE varchar(100);
                    `);
                    console.log(`table ${tableName} identifier field type altered`)
                }
            }
            
            await client.query(`
                ALTER TABLE ${name} ALTER COLUMN ${idField} TYPE varchar(100);
            `)
            console.log(`table ${name} identifier field type altered`)


            // * changing records

            const {rows} = await client.query(`SELECT ${idField} as id FROM ${name}`);

            console.log(`${rows.length} rows from table ${name} where found`)

            for (let i = 0; i < rows.length; i++) {
                const {id} = rows[i];

                if(ULIDIsValid(id)){
                    continue;
                }
                const generatedUlid = ulid();

                if (relations?.length) {
                    for (let i = 0; i < relations.length; i++) {
                        const {
                            tableName,
                            relField
                        } = relations[i];
    
                        await client.query(`
                            UPDATE ${tableName} SET ${relField} = '${generatedUlid}' WHERE ${relField} = '${id}'
                        `);
                        console.log(`table ${tableName} identifier field changed from '${id}' to ${generatedUlid}`)
                    }
                }

                await client.query(`
                    UPDATE log SET row_id = '${generatedUlid}' WHERE row_id = '${id}'
                `);

                await client.query(`
                    UPDATE ${name} SET ${idField} = '${generatedUlid}' WHERE ${idField}  = '${id}'
                `);
                console.log(`table ${name} identifier field changed from '${id}' to ${generatedUlid}`)
            }


            // if (relations?.length) {
            //     for (let i = 0; i < relations.length; i++) {
            //         const {
            //             tableName,
            //             relField
            //         } = relations[i];

            //         await client.query(`
            //             ALTER TABLE ${tableName} ALTER COLUMN ${relField} TYPE varchar(36);
            //         `);
            //         console.log(`table ${tableName} identifier field max chars changed to 36`)
            //     }
            // }
            
            // await client.query(`
            //     ALTER TABLE ${name} ALTER COLUMN ${idField} TYPE varchar(36);
            // `)
            // console.log(`table ${name} identifier field max chars changed to 36`)
            
        }
        await client.query('commit')
        console.log("transaction committed")
        
        
    } catch (error) {
        console.log("🚀 ~ migrateToULID ~ error:", error)
        await client.query('rollback')
        console.log("transaction rolled back")
    }finally{
        await client.end()
    }
}

migrateToULID();

function ULIDIsValid (id) {
    return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(id);
}