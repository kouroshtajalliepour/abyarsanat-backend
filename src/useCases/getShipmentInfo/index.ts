export default async function ({provinceId, cityId, totalPrice, weight} = {provinceId:"", weight: '', totalPrice: "", cityId: ""}){

    const {
        makeValidateString,
        validateNumber
    } = useValidators()

    const {
        validCities,
        validProvinces
    } = useRuntimeConfig()

    const validateProvinceId = makeValidateString(validProvinces)
    const validateCityId = makeValidateString(validCities)

    const {
        shipment
    } = useFrameworks()


    try {

        const validatedProvinceId = await validateProvinceId(provinceId)
        const validatedCityId = await validateCityId(cityId)
        const validatedWeight = await validateNumber(weight as any)
        const validatedTotalPrice = await validateNumber(totalPrice as any)
        const shipmentInfo = await shipment({
            provinceId: validatedProvinceId,
            weight: validatedWeight,
            cityId: validatedCityId,
            totalPrice: validatedTotalPrice

        })

            console.log("🚀 ~ shipmentInfo:", shipmentInfo)
        return {
            shipmentInfo
        }

    } catch (error:any) {
        throw error
    }
}