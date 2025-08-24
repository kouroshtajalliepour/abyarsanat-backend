const { S3Client, HeadObjectCommand, CopyObjectCommand } = require('@aws-sdk/client-s3');
const { Client } = require('pg');

// ArvanCloud S3 credentials
const accessKeyId = '395d9b21-eeae-412e-8ff4-aee005c1ad08';
const secretAccessKey = '85d8f3481b4494cc7eb5ffc2dd3a3e1809911c9257bcd210b0dc1c4a999d5c9c';
const bucket = 'abyarsanat';

// Initialize S3 client for ArvanCloud
const s3Client = new S3Client({
    region: 'ir-thr-at1',
    endpoint: "https://s3.ir-thr-at1.arvanstorage.ir",
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
});
const client = new Client({
    user: 'ubuntu',
    database: 'abyarsanat',
    password: '123',
    port: 5432,
});



async function updateContentType() {
    try {
        await client.connect();
        const {rows:files} = await client.query(`SELECT url, format FROM file WHERE URL IS NOT NULL AND FORMAT IS NOT NULL AND url LIKE 'https://${bucket}.s3.ir-thr-at1.arvanstorage.com/%'`);

        let format, key;
        for (const file of files) {
            try {
                
                format = file.format
                key = file.url.replace(`https://${bucket}.s3.ir-thr-at1.arvanstorage.com/`, '');
                console.log(`Extracted Key: ${key}`);
    
                const headCommand = new HeadObjectCommand({ Bucket: bucket, Key: key });
                const headResponse = await s3Client.send(headCommand);
                console.log("🚀 ~ updateContentType ~ headResponse:", headResponse);
    
                // Copy object with new content type while preserving existing metadata
                const copyCommand = new CopyObjectCommand({
                    Bucket: bucket,
                    CopySource: `${bucket}/${key}`,
                    Key: key,
                    ContentType: format,
                    Metadata: headResponse.Metadata, // Preserve existing metadata
                    MetadataDirective: 'REPLACE', // Replace metadata without re-uploading
                    ACL: 'public-read' // Ensure the ACL is set to public-read
                  });
                  await s3Client.send(copyCommand);
    
                console.log(`✅ Updated Content-Type for '${key}' to '${format}'`);
            } catch (error) {
                console.log(`❌ Updating Content-Type failed for '${key}' to '${format}'`);
                
            }
        }
    } catch (err) {
        if (err.code === 'NoSuchKey') {
            console.error('Error: The specified key does not exist.');
        } else {
            console.error(`ClientError: ${err.code}`);
            console.error(`Error Response: ${err}`);
        }
    }finally{
        await client.end()
    }
}

// Call the function to test
updateContentType();