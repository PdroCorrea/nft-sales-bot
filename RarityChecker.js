const axios = require("axios");
const fs = require("fs");

const pollingInterval = 5000; // ms

const getAttributes = async () => {
    
        try {
            var projectName = "enter_the_jungle_";
            const { data } = await axios.get("https://api-mainnet.magiceden.io/rpc/getListedNFTsByQuery?q=%7B%22%24match%22%3A%7B%22collectionSymbol%22%3A%22enter_the_jungle_%22%7D%2C%22%24sort%22%3A%7B%22takerAmount%22%3A1%2C%22createdAt%22%3A-1%7D%2C%22%24skip%22%3A0%2C%22%24limit%22%3A20%7D");
            // console.log(JSON.stringify(data,null,2));
            console.log(data);
            const attributes = data.results.availableAttributes;
            //fs.writeFile(`${projectName}.json`, attributes, 'utf8', callback);
            fs.writeFile (`${projectName}.json`, JSON.stringify(attributes), function(err) {
                if (err) throw err;
                console.log('complete');
                }
            );
            // console.log(JSON.stringify(data,null,2));
            //console.log(data);
            const price =
            Math.abs(data.results.floorPrice /1000000000);
            console.log("-------------------------------------------");
            console.log(`Floor Price: ${price} SOL`);
            console.log(`List Count: ${data.results.listedCount}`);
            console.log(`Listed Total Value: ${Math.round(Math.abs(data.results.listedTotalValue /1000000000))} SOL`);
            console.log(`avgPrice24hr: ${(data.results.avgPrice24hr /1000000000).toFixed(2)} SOL`);
            console.log(`Volume: ${Math.round(Math.abs(data.results.volumeAll /1000000000))} SOL`);
            //console.log(price);/
            //return data;
            count++;
            //postSaleToDiscord(price, data.results.listedCount, (data.results.avgPrice24hr /1000000000).toFixed(2), Math.round(Math.abs(data.results.volumeAll /1000000000)));

            await timer(pollingInterval);

        } catch (error) {
            console.log("error fetching metadata: ", error);
        }
   
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const postSaleToDiscord = (price, listCount, avgPrice24hr, volume) => {
    axios.post('https://discord.com/api/webhooks/933467569711616033/Hfa2HUzlPVEkyR4BbUk8zUQZelOTq_q6blOt-BX4paORszoA4HDvP1BDccoH_HOL3ter', {
        embeds: [
            {
                title: `Current Floor Price on ME`,
                description: `Stats:`,
                fields: [
                    {
                        name: "Floor Price",
                        value: `${price} SOL`,
                        inline: true,
                    },
                    {
                        name : "List Count",
                        value : `${listCount}`
                
                    },
                    {
                        name: "Average Price Last 24h",
                        value: `${avgPrice24hr} SOL`,
                        inline: true,
                    },
                    {
                        name: "Volume",
                        value: `${volume} SOL`,
                    },
                ],
            },
        ],
    });
};


getAttributes();