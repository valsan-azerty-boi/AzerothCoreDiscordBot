const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const db = require("../databasesql.js");

module.exports = {
    name: "online",
    description: "Gives total count of online players.",
    DMonly: true,

    async execute(message) {
        try {
            const countResults = await db.queryCharacter("SELECT COUNT(name) AS onlineCount FROM characters WHERE online = 1");
            const onlineCount = countResults[0].onlineCount;

            const embed = new EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle("Online Players")
                .setDescription("Total count of online players.")
                .addFields({ name: "Amount of characters online:", value: `${onlineCount}` })
                .setTimestamp()
                .setFooter({ text: "Online command", iconURL: client.user?.displayAvatarURL() || "" });

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error("Unexpected Error: ", err);
            await message.channel.send("Internal Error.");
        }
    },
};
