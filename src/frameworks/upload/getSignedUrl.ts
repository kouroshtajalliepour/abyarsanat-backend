export default ({
  S3Client,
  PutBucketCorsCommand,
  createPresignedPost,
}: any) => {
  return async (
    file: any,
    provider: string
  ):IUploadFunction => {


    const {
      endpoint, 
      accessKeyId, 
      secretAccessKey, 
      Bucket
    } = useUploadMethod('signedUrl')
    
    try {

      const { format, id, size } = file

      if (!size || !format || !provider) {
        throw new Error('useCases.errors.general.noFieldSpecified')
      }

      const res = await getSignedUrl(
        { format, id, size,provider },
        {
          endpoint,
          accessKeyId,
          secretAccessKey,
          Bucket,
        },
        {
          S3Client,
          PutBucketCorsCommand,
          createPresignedPost,
        }
      )
      return res
    } catch (error: any) {
      console.log("🚀 ~ error:", error)
      throw error
    }
  }
}

async function getSignedUrl(
  { format, id, size,provider}: any = {},
  { endpoint, accessKeyId, secretAccessKey, Bucket }: any = {},
  { S3Client, PutBucketCorsCommand, createPresignedPost }: any = {}
) {
  return new Promise<any>(async (resolve, reject) => {
    try {
      
      const {uploadCorsOrigin} = useRuntimeConfig()

      // Create an S3 client service object
      const s3 = new S3Client({
        region: 'default',
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
      
      const Key = `${id}.${format.split('/')[1]}`
      const Fields = {
        acl: 'public-read',
        'Content-Type': format
      }

      const cors = {
        Bucket, // REQUIRED

        CORSConfiguration: {
          // REQUIRED

          CORSRules: [
            {
              AllowedHeaders: ['*'],
              AllowedMethods: ['POST'],
              AllowedOrigins: [
                uploadCorsOrigin ? uploadCorsOrigin : '*'  // 'https://admin.abyarsanat.com'
              ],
            },
          ],
        },
      }

      
      const Conditions = [
        { 
          acl: 'public-read',
          'ContentType': format
        }, 
        { 
          bucket: Bucket 
        }
      ]

      const response = await s3.send(new PutBucketCorsCommand(cors))
      if (response['$metadata'].httpStatusCode !== 200) {
        return null
      }
      const res = await createPresignedPost(s3, {
        Bucket,
        Key,
        Conditions,
        Fields,
        Expires: 600, //Seconds before the presigned post expires. 3600 by default.
      })
      const result = {...res, dbResult: {provider,size,format, url: `https://${res.fields.bucket}.s3.ir-thr-at1.arvanstorage.com/${res.fields.key}`}}
      resolve(result)
    } catch (error: any) {
      reject(error)
    }
  })
}
