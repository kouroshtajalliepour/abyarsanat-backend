import axios from "axios"

type ICalculatePostalShipmentConfigInputs = {
    sameProvinceBasePrice: number
    neighborProvinceBasePrice: number
    otherProvinceBasePrice: number
    sameProvinceAdditionalWeightPrice: number
    neighborProvinceAdditionalWeightPrice: number
    otherProvinceAdditionalWeightPrice: number
    insurancePrice: number
    productBasePrice: number
}


function calculatePostalShipment({
    sameProvinceBasePrice,
    neighborProvinceBasePrice,
    otherProvinceBasePrice,
    sameProvinceAdditionalWeightPrice,
    neighborProvinceAdditionalWeightPrice,
    otherProvinceAdditionalWeightPrice,
    insurancePrice,
    productBasePrice
}: ICalculatePostalShipmentConfigInputs, province_id: string, totalWeight: number) {

    const isSame = province_id === "30";
    const isNeighbor = ["23", "26", "25", "00", "02"].includes(province_id);

    const basePrice = isSame
    ? sameProvinceBasePrice
    : isNeighbor
    ? neighborProvinceBasePrice
    : otherProvinceBasePrice;

    const additionalWeightPrice = isSame
    ? sameProvinceAdditionalWeightPrice
    : isNeighbor
    ? neighborProvinceAdditionalWeightPrice
    : otherProvinceAdditionalWeightPrice;


    const extraUnits = Math.floor(Math.max(0, totalWeight - 1000) / 1000);
    const extraWeightCost = extraUnits * additionalWeightPrice;
    const totalCost = Number(extraWeightCost) +Number(basePrice) + Number(insurancePrice) + Number(productBasePrice)

    return totalCost * 110 / 100;
}


export default async function calculateShipment({weight, provinceId, cityId, totalPrice} = {weight:0, provinceId: "", cityId: "", totalPrice: 0} ){
    if (!provinceId || !cityId) {
      throw new Error("useCases.errors.general.oldAddressVersion")
    }

    const {
        shipment: {
            iranPost: {
                sameProvinceBasePrice,
                neighborProvinceBasePrice,
                otherProvinceBasePrice,
                sameProvinceAdditionalWeightPrice,
                neighborProvinceAdditionalWeightPrice,
                otherProvinceAdditionalWeightPrice,
                insurancePrice,
                productBasePrice,
            },
            chapar: {
                origin,
                method,
                sender_code,
                receiver_code,
                cod,
                baseAddedPrice
            }
        }
    } = useRuntimeConfig()

    let chapar = undefined as any
    const body = {
        order: {
            origin,
            method,
            sender_code,
            receiver_code,
            cod,
            weight: Math.floor(weight / 1000),
            value: totalPrice,
            destination: cityId
        },

    }

    const formData = new FormData()
    formData.append("input", JSON.stringify(body))
    const {validateNumber} = useValidators()

    try {
        
        const {data} = await axios.post("https://app.krch.ir/v1/get_quote", formData)
        const validatedResult = await validateNumber (data?.objects?.order?.quote);
        chapar = validatedResult ? Number(validatedResult) + baseAddedPrice : undefined
    } catch (error:any) {
        
    }


    const tear1 = calculatePostalShipment(
      {
        sameProvinceBasePrice ,
        neighborProvinceBasePrice ,
        otherProvinceBasePrice ,
        sameProvinceAdditionalWeightPrice ,
        neighborProvinceAdditionalWeightPrice ,
        otherProvinceAdditionalWeightPrice ,
        insurancePrice,
        productBasePrice
      },
      provinceId, 
      weight
    )


    return {
      iranPost: tear1,
      chapar: chapar,
    }
}