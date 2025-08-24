
import getInfo from "../../dataAccess/info"
import getPage from "../../dataAccess/page"
import fetchCartItems from "../../dataAccess/fetchCartItems"


export default async function ({id, locale, fetchInfo, cartItems} : {id: string, locale: string, fetchInfo?: boolean,cartItems:string} = {id: '', locale: '', fetchInfo: false,cartItems:'{}'}){
    
    try {

        const {
            pages
        } = useRuntimeConfig()

        if (
            !id || 
            typeof id !== 'string' || 
            id.length > 50 || 
            !locale || 
            typeof locale !== 'string' || 
            locale.length > 50
        ) {
            throw new Error("useCases.errors.general.invalidFields")
        }
        
        
        let result = {} as any
        if (fetchInfo) {
            result.info = await getInfo({locale})
        }

        if (id === 'cart') {
            result.cartItems = await fetchCartItems(locale,cartItems? JSON.parse(cartItems): {})
        }

        if (pages.includes(id)) {
            const page = await getPage({id, locale})
            result.page = page
        }


        return {
            page: result.page,
            cartItems: id == 'cart' ?  result.cartItems ? result.cartItems : [] : undefined,
            info: result.info
        }

        // return await getMenu()

    } catch (error:any) {
        throw error
    }
}