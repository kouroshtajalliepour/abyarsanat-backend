import Validate from "./validate"
import jwt from "jsonwebtoken"
const validate = Validate(jwt)

export default function makeAuthorValidateFunction (key:string){
    return async function authorValidateFunction ({token}:any){
        const {payload} = await validate({
            token,
            key,
        }) as any

        if(!payload){
            throw new Error("useCases.errors.general.invalidToken")
        }

        return payload
    }
}