const { TOKEN_PROGRAM_ID } =require( "@solana/spl-token");
const { Connection, PublicKey } =require( "@solana/web3.js");
const  SPLToken =require( "@solana/spl-token");
//const { Connection, programs } = require("@metaplex/js");
// get token accounts by owner

const connection = new Connection('https://solana--mainnet--rpc.datahub.figment.io/apikey/383fe0c73b6aa074333bdcd4589ed4b4/', "confirmed");

async function main() {
  // 1. you can fetch all token account by an owner
  let response = await connection.getTokenAccountsByOwner(
    new PublicKey("9nHE1aeQZNqd6YcjD8NqjfK2votmbAWkfxvhoJswxX4U"), // owner here
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );
  console.log(`Total NFTs: ${response.value.length}`);

  //console.log(JSON.stringify(response,null,2));

  response.value.forEach((e) => {
    console.log(`pubkey: ${e.pubkey.toBase58()}`);
    const accountInfo = SPLToken.AccountLayout.decode(e.account.data);
    console.log(`mint: ${new PublicKey(accountInfo.mint)}`);
    console.log(`amount: ${SPLToken.u64.fromBuffer(accountInfo.amount)}`);
  });

  console.log("-------------------");

  // 2. or just fetch specific mint for a owner
  let response2 = await connection.getTokenAccountsByOwner(
    new PublicKey("27kVX7JpPZ1bsrSckbR76mV6GeRqtrjoddubfg2zBpHZ"), // owner here
    {
      mint: new PublicKey("E4ZN2KmnVmpwLwjJNAwRjuQLeE5iFHLcAJ8LGB7FMaGQ"),
    }
  );
  response2.value.forEach((e) => {
    console.log(`pubkey: ${e.pubkey.toBase58()}`);
    const accountInfo = SPLToken.AccountLayout.decode(e.account.data);
    console.log(`mint: ${new PublicKey(accountInfo.mint)}`);
    console.log(`amount: ${SPLToken.u64.fromBuffer(accountInfo.amount)}`);
  });
}


main().then(
  () => process.exit(),
  (err) => {
    console.error(err);
    process.exit(-1);
  }
);