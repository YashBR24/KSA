const CryptoJS = require("crypto-js");

const encryptedData = "U2FsdGVkX18ZOVr2BGo1Faj9sk0CW9jNMhSqRPnyvmE=";
const secretKey = "FetchTurfActiveStatus";

// Decrypt the string
const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

console.log(decryptedData);
