export default (encryptionFunction:any, saltGeneratorFunction: any) => {

    return (textToEncrypt:string) => {
        
        return saltGeneratorFunction().then((salt:string) => {
            
            return encryptionFunction(textToEncrypt, salt);
        }).catch((e:any) => {
            throw e;  
        })
    }

}