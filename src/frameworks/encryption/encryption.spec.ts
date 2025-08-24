const {convertPasswordToBase32, encrypt, decrypt} = require("./index")

describe('encryption framework', () => {

    describe('encryption function ConvertPasswordToBase32', () => {

        it("Won't work with password more than 32 digits", () => {
            const password = 'asdffflkjsal;dkfjhopwiejfoaiddggsuniuwen';
            const key = 'asdcvfgbhnjmkiuytfdsrewsdfgjvnise'
            
            const result = convertPasswordToBase32(key, password)
            expect(result)
                .toBe(false)
        });
    
        it("Won't work without a password", () => {
            const password = '';
            const key = 'asdcvfgbhnjmkiuytfdsrewsdfgjvnise'
    
            const result = convertPasswordToBase32(key, password)
            expect(result)
                .toBe(false)
             
        });
    
        it("Won't work with invalid key", () => {
            const password = '';
            const key = 'arewsdfgjvnis'
    
            const result = convertPasswordToBase32(key, password)
            expect(result)
                .toBe(false)
             
        });
    
        it("Works with correct key and correct password", () => {
            const password = 'sakdfilhukj';
            const key = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
    
            const result = convertPasswordToBase32(key, password).toString().length
            expect(result).toBe(32)
             
        });
    
    });

    describe('encryption encrypt function', () => {

        it("won't work without a base32 password", () => {
            const secretKey = "sdlkfjsfd";
            const testToEncrypt = "it wont work";
            const result = encrypt (testToEncrypt, secretKey);
            expect(result).toBe(false);
        }) 
        it("it works with a base32 password", () => {
            const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
            const testToEncrypt = "aksdjhfoiajsdliujakisuhkiuh";
            const result = encrypt (testToEncrypt, secretKey);
            expect(result).toBeTruthy();
        }) ;

    })

    describe('encryption decrypt function', () => {

        let encrypted:string;
        beforeEach(() => {
            const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
            const testToEncrypt = "aksdjhfoiajsdliujakisuhkiuh";
            encrypted = encrypt(testToEncrypt, secretKey);
            
        })

        it("won't work with password less than 32 digits", () => {
            const password = "vOVH6sdmpNWj";
            const id = "aksdjhfoiajsdliujakisuhkiuh"
            const result = decrypt(encrypted,password, id)
            expect(result).toBeFalsy()
        })
        it("won't work with password more than 32 digits", () => {
            const password = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3sdfkjhks";
            const id = "aksdjhfoiajsdliujakisuhkiuh"
            const result = decrypt(encrypted,password, id)
            expect(result).toBeFalsy()
        })

        it("won't work with invalid password", () => {
            const password = "vOVH6sdklNWjRRIqCc7rdxs01lwhzfr3";
            const id = "aksdjhfoiajsdliujakisuhkiuh"
            const result = decrypt(encrypted,password, id)
            expect(result).toBeFalsy()
        })

        it("won't work with invalid id", () => {
            const password = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
            const id = "aksdjhfoiajsdsiuh"
            const result = decrypt(encrypted,password, id)
            expect(result).toBeFalsy()
        })

        it("works with the correct password", () => {
            const password = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
            const id = "aksdjhfoiajsdliujakisuhkiuh"
            const result = decrypt(encrypted,password, id)
            expect(result).toBeTruthy()
        })

    })


})