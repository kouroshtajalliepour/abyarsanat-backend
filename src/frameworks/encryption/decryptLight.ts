export default (decryptionFunction:any) => {

    return async(encryptedText:string, textToCheck:string) => {
        
        
        return decryptionFunction(textToCheck, encryptedText); 
    }

}