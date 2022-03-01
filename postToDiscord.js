const axios = require("axios");

const postSaleToDiscord = async (title, price, date, signature, imageURL, marketplace) => {
    console.log("started posting to discord");
    //https://discord.com/api/webhooks/933467569711616033/Hfa2HUzlPVEkyR4BbUk8zUQZelOTq_q6blOt-BX4paORszoA4HDvP1BDccoH_HOL3ter
    const discordUrl = 'https://discord.com/api/webhooks/933467569711616033/Hfa2HUzlPVEkyR4BbUk8zUQZelOTq_q6blOt-BX4paORszoA4HDvP1BDccoH_HOL3ter';
    await axios.post(discordUrl, {
        embeds: [
            {
                
                title: `New Sale`,
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

postSaleToDiscord();