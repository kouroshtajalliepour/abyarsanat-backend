import jwt from "jsonwebtoken"


import generate from "./generate";
import validate from "./validate";
import makeAuthorGenerateFunction from "./makeAuthorGenerateFunction";
import makeAuthorValidateFunction from "./makeAuthorValidateFunction";

export default {
    generate: generate(jwt),
    validate: validate(jwt),
    makeAuthorGenerateFunction,
    makeAuthorValidateFunction
}