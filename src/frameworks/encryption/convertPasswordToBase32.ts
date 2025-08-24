export default (secretKey: string, password:string) => {

    if(!password.length || password.length > 32){
        return false;
    }

    if(secretKey.length !== 32) {
        return false;
    }

    return`${secretKey.split('').splice(password.length).join('')}${password}`;
    
}