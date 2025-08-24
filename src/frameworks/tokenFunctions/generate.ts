export default (jwt:any) => {

    return ({

        payload,
        key,
        expireTime 

    }:any = {}) => {

        let token;

        if (expireTime){
            
            token = jwt.sign({payload}, key, { expiresIn: `${expireTime.toString()}s` });   

        }else{

            token = jwt.sign({payload}, key);

        }

        return token;
    
    };

}