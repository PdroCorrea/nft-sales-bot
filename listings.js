const solanaWeb3 = require("@solana/web3.js");
const { Connection, programs } = require("@metaplex/js");
const axios = require("axios");
const fs = require("fs");

if (!process.env.PROJECT_ADDRESS || !process.env.DISCORD_URL) {
    console.log("please set your environment variables!");
    console.log(process.env.PROJECT_ADDRESS);
    return;
}
//console.log(solanaWeb3);
const projectPubKey = new solanaWeb3.PublicKey(process.env.PROJECT_ADDRESS);
const url = solanaWeb3.clusterApiUrl("mainnet-beta");
//console.log(url);
const solanaConnection = new solanaWeb3.Connection('https://solana--mainnet--rpc.datahub.figment.io/apikey/383fe0c73b6aa074333bdcd4589ed4b4/', "confirmed");
//console.log("connection:")
//console.log(solanaConnection);
const metaplexConnection = new Connection("mainnet-beta");
const {     metadata: { Metadata }, } = programs;
const pollingInterval = 5000; // ms
const marketplaceMap = {
    MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8: "Magic Eden",
    M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K: "Magic Eden",
    HZaWndaNWHFDd9Dhk5pqUUtsmoBCqzb1MLu3NAh1VX6B: "Alpha Art",
    "617jbWo616ggkDxvW1Le8pV38XLbVSyWY8ae6QUmGBAU": "Solsea",
    CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz: "Solanart",
    A7p8451ktDCHq5yYaHczeLMYsjRsAkzc3hCXcSrwYHU7: "Digital Eyes",
    AmK5g2XcyptVLCFESBCJqoSfwV3znGoVYQnqEnaAZKWn: "Exchange Art",
    ArAA6CZC123yMJLUe4uisBEgvfuw2WEvex9iFmFCYiXv: "Launch My NFT"
};

const runSalesBot = async () => {
    console.log("starting sales bot...");

    let signatures;
    let lastKnownSignature;
    let bootupDate = new Date(2022, 1, 6, 12, 35, 0, 0);
    //let bootupDate = new Date();
    const options = {};
    while (true) {
        try {
            signatures = await solanaConnection.getSignaturesForAddress(
                projectPubKey,
                options
            );
            //console.log("called signatures => ", signatures);
            if (!signatures.length) {
                console.log("polling...");
                await timer(pollingInterval);
                continue;
            }

        } catch (err) {
            console.log("error fetching signatures: ", err);
            continue;
        };
        let listingTransactions = [];
        let listingsMetadata = [];
        for (let i = signatures.length - 1; i >= 0; i--) {
            try {
                let { signature } = signatures[i];
                const signatureDate = new Date(signatures[i].blockTime * 1000);
               
                if (signatureDate > bootupDate){
                    const txn = await solanaConnection.getTransaction(signature);
                    console.log("called solana");
                    if (txn.meta && txn.meta.err != null) {
                        continue;
                    }
                    //console.log("token info:");
                    ////console.log(JSON.stringify(txn,null,2));
                    const transactionDate = new Date(txn.blockTime * 1000);
                    const dateString = transactionDate.toLocaleString();
                    const price =
                        Math.abs(txn.meta.preBalances[0] - txn.meta.postBalances[0]) /
                        solanaWeb3.LAMPORTS_PER_SOL ;
                    const accounts = txn.transaction.message.accountKeys;
                    const marketplaceAccount = accounts[accounts.length - 1].toString();
                    //console.log("marketPlaceAccount => ", marketplaceAccount);
               
                    if (price < 0.01) {
                        for(let a = 0; a <= txn.meta.preBalances.length ; a++){
                            console.log(`Price for balance ${a+1} is ${Math.abs(txn.meta.preBalances[a] - txn.meta.postBalances[a]) /
                                solanaWeb3.LAMPORTS_PER_SOL}`)

                        }
                        if (marketplaceMap[marketplaceAccount]) {
                            const metadata = await getMetadata(txn.meta.postTokenBalances[0].mint);
                            if (!metadata) {
                                console.log("couldn't get metadata");
                                continue;
                            }
                            // console.log("metadata info from mint:");
                            // console.log(metadata);
                            // printSalesInfo(
                            //     dateString,
                            //     price,
                            //     signature,
                            //     metadata.name,
                            //     marketplaceMap[marketplaceAccount],
                            //     metadata.image
                            // );
                            listingsMetadata.push(metadata);
                            listingTransactions.push(txn);
                            console.log(`small transaction value, probably listing  cost ${price}, ${metadata.name}, from ${marketplaceMap[marketplaceAccount]}`);
                            // await postSaleToDiscord(
                            //     metadata.name,
                            //     price,
                            //     dateString,
                            //     signature,
                            //     metadata.image,
                            //     marketplaceMap[marketplaceAccount]
                            // );
                        } else {
                                marketplaceMap[marketplaceAccount],
                                console.log("not a supported marketplace sale from: ", marketplaceAccount );
                        }
                    } else {
                        if(price < 0.03){
                            console.log(`maybe small transaction value, probably listing  cost ${price}`);

                        }else{
                            console.log(`big transaction value, probably not a listing  cost ${price}`);
                        }
                    }
                }
           
            } catch (err) {
                console.log("error while going through signatures: ", err);
                continue;
            }
        }
        // fs.writeFile (`listingsMetadata.json`, JSON.stringify(listingsMetadata,2,null), function(err) {
        //     if (err) throw err;
        //     console.log('complete metadata');
        //     });
        //     fs.writeFile (`listingsTransactions.json`, JSON.stringify(listingTransactions,2,null), function(err) {
        //         if (err) throw err;
        //         console.log('complete metadata');
        //         });
        lastKnownSignature = signatures[0].signature;
        if (lastKnownSignature) {
            options.until = lastKnownSignature;
        }
    }
};
runSalesBot();

const printSalesInfo = (
    date,
    price,
    signature,
    title,
    marketplace,
    imageURL
) => {
    console.log("-------------------------------------------");
    console.log(`Sale at ${date} ---> ${price} SOL`);
    console.log("Signature: ", signature);
    console.log("Name: ", title);
    console.log("Image: ", imageURL);
    console.log("Marketplace: ", marketplace);
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const getMetadata = async (tokenPubKey) => {
    try {
        const addr = await Metadata.getPDA(tokenPubKey);
        const resp = await Metadata.load(metaplexConnection, addr);
        const { data } = await axios.get(resp.data.data.uri);

        return data;
    } catch (error) {
        console.log("error fetching metadata: ", error);
    }
};

const postSaleToDiscord = (title, price, date, signature, imageURL, marketplace) => {
    console.log("started posting to discord");
    
    axios.post(process.env.DISCORD_URL, {
        embeds: [
            {
                title: `SALE`,
                description: `${title}`,
                fields: [
                    {
                        name: "Price",
                        value: `${price} SOL`,
                        inline: true,
                    },
                    {
                        name : "Market Place",
                        value : `${marketplace}`
                
                    },
                    {
                        name: "Date",
                        value: `${date}`,
                        inline: true,
                    },
                    {
                        name: "Explorer",
                        value: `https://explorer.solana.com/tx/${signature}`,
                    },
                ],
                image: {
                    url: `${imageURL}`,
                },
                footer:{
                    text: "Developed by @SharpServices.Sol"
                }
            },
        ],
    });
    console.log("finished posting to discord");
};
