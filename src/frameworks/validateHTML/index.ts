const HTMLParser = require("@desertnet/html-parser");

export default (content:string) => {
    
    const errors =  HTMLParser.validate(content)
    return errors
}