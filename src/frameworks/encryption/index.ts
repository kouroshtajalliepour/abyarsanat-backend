import encrypt from "./encrypt";
import decrypt from "./decrypt";
import convertPasswordToBase32 from "./convertPasswordToBase32";


import {randomBytes, createCipheriv, createDecipheriv} from "crypto";

export default  {
    encrypt: encrypt(createCipheriv, randomBytes(16)),
    decrypt: decrypt(createDecipheriv),
    convertPasswordToBase32
};