export default (decryptionFunction:any) => {

    return (encryptedText:string, secretKey:string, id:string) => {
        
        if(secretKey.length !== 32){
            return false
        }

        const splicedHash = encryptedText.split(':')
    
        const hashIv = splicedHash[0]
        const hashContent = splicedHash[1]
    
        const decipher = decryptionFunction('aes-256-ctr', secretKey, Buffer.from(hashIv, 'hex'));
    
        const decrypted = Buffer.concat([decipher.update(Buffer.from(hashContent, 'hex')), decipher.final()]);
    
        const result = decrypted.toString();
        
        return result === id;
    }

}