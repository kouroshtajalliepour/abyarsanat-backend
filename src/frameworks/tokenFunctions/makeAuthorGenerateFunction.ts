import Generate from "./generate"
import jwt from "jsonwebtoken"
const generate = Generate(jwt)



export default function makeAuthorGenerateFunction (key:string){
    return async function generateAuthorToken ({author: {id, token_id}}:any){
        const payload = {
            id,
            token_id
        }
        return await generate({
            payload,
            key,
        });
    }
}