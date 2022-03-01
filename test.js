// import theblockchainapi from 'theblockchainapi';
const theblockchainapi = require("theblockchainapi");

let defaultClient = theblockchainapi.ApiClient.instance;

// Get a free API Key Pair here: https://dashboard.blockchainapi.com/api-keys

let APIKeyID = defaultClient.authentications['APIKeyID'];
APIKeyID.apiKey = 'OTBsYcZzNB6Rqih';

let APISecretKey = defaultClient.authentications['APISecretKey'];
APISecretKey.apiKey = 'PAhynOA9EjqBQTP';

const test = async () => {



let apiInstance = new theblockchainapi.SolanaNFTApi();

let getCandyMachineIdRequest = new theblockchainapi.GetCandyMachineIDRequest();
getCandyMachineIdRequest.network = 'mainnet-beta';
getCandyMachineIdRequest.mint_address = '4e9qDvELe8Vr9kw8mB8xkLLQ8GrgPeKdGdSaCdaJph57';

let opts = {
  'getCandyMachineIDRequest': getCandyMachineIdRequest
};

// Yes, minted with a V1 candy machine.
let result = await apiInstance.solanaGetNFTsCandyMachineId(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
  return data;
}, (error) => {
  console.error(error);
  return null;
});
console.log("Candy Machine Id:", result);

// Yes, minted with a V2 candy machine.
getCandyMachineIdRequest.mint_address = '63k8TCFNfQigyCfR4hvZg5moHZQ2uJYnfsuoDnrjHyeb';
result = await apiInstance.solanaGetNFTsCandyMachineId(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
  return data;
}, (error) => {
  console.error(error);
  return null;
});
console.log("Candy Machine Id:", result);

// No, not minted with a candy machine ID.
getCandyMachineIdRequest.mint_address = 'GoxY1RhbuVwvQAWJ9DMT2PZWNJR6peQCy8cuKJHvb44e';
result = await apiInstance.solanaGetNFTsCandyMachineId(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
  return data;
}, (error) => {
  console.error(error['body']['error_message']);
  return null;
});
console.log("Candy Machine Id:", result);
}


const GetAllNFTsResponse = async () =>{

//     let defaultClient = theblockchainapi.ApiClient.instance;

// // Get a free API Key Pair here: https://dashboard.blockchainapi.com/api-keys

// let APIKeyID = defaultClient.authentications['APIKeyID'];
// APIKeyID.apiKey = 'API-KEY-ID';

// let APISecretKey = defaultClient.authentications['APISecretKey'];
// APISecretKey.apiKey = 'API-SECRET-KEY';

let apiInstance = new theblockchainapi.SolanaCandyMachineApi();

let network = "mainnet-beta"; // String | The network ID (devnet, mainnet-beta)
let candyMachineId = "E6hWzffEzKdoF2Dpanhhh88dMgNGG3ttH3wMEh1wPfeV"; // String | The ID of the candy machine

console.log("This takes about 45 seconds... Starting the API call...")

let result = await apiInstance.solanaGetAllNFTsFromCandyMachine(network, candyMachineId).then((data) => {
  console.log('API called successfully.');
  return data;
}, (error) => {
  console.error(error);
  return null;
});

console.log(result);

candyMachineId = "E6hWzffEzKdoF2Dpanhhh88dMgNGG3ttH3wMEh1wPfeV"; // String | The ID of the candy machine
// We don't have to specify whether the candy is v1 or v2 this time. It auto-detects it.

console.log("This takes about 45 seconds... Starting the API call...");
console.log(
    "Retrieving all NFTs from a V2 candy machines... This API call can take around 45 seconds..."
)

result = await apiInstance.solanaGetAllNFTsFromCandyMachine(network, candyMachineId).then((data) => {
  console.log('API called successfully.');
  return data;
}, (error) => {
  console.error(error);
  return null;
});

console.log(result);
}

//test();
GetAllNFTsResponse();