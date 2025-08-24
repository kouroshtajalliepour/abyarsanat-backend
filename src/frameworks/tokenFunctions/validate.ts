export default (jwt:any) => {

    return async ({

        token, 
        key 

    }:any = {}) => {
        if (!token || typeof token !== "string") {
            return false;
        }

        const Token = token.split(' ')[1];
        try{
            const result = await jwt.verify(Token, key);
            
            return result;
        }catch (e) {
            return false;
        }

    };

}