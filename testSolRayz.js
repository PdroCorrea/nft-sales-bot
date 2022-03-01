import {
    resolveToWalletAddress,
    getParsedNftAccountsByOwner,
  } from "@nfteyez/sol-rayz";
const { Connection, programs } = require("@metaplex/js");

  
  const address = "9nHE1aeQZNqd6YcjD8NqjfK2votmbAWkfxvhoJswxX4U";
  // or use Solana Domain
//   const address = "NftEyez.sol";
  
  const publicAddress = await resolveToWalletAddress({
    text: address
  });
  
  const nftArray = await getParsedNftAccountsByOwner({
    publicAddress,
  });
  console.log(nftArray)