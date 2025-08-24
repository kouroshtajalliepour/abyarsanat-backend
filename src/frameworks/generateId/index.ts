const {ulid} = require('ulid');

export default function generateId ()  {
    
    return ulid()
}