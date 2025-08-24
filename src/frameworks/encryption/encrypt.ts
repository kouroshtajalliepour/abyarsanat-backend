export default (encryptionFunction:any, randomBytes:any ) => {

    return (textToEncrypt:any, secretKey:string) => {

        if(secretKey.length !== 32){
            return false
        }

        const cipher = encryptionFunction('aes-256-ctr', secretKey, randomBytes);
    
        const encrypted = Buffer.concat([cipher.update(textToEncrypt), cipher.final()]);
    
        return  `${randomBytes.toString('hex')}:${encrypted.toString('hex')}`

    }

}