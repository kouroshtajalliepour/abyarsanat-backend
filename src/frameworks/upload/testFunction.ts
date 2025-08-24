type ITestFunctionInputs = {
    format: string,
    provider: string
}

export default async function uploadFunction ({format, provider}:ITestFunctionInputs) {
    return {
        dbResult: {
            url: "http://test.com/lsdkfjjh",
            format: "image/jpeg",
            provider: "local"
        },
        apiResult: {
            test: true
        }
    }
}
