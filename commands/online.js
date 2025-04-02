const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");

module.exports = {
    name: "online",
    description: "Gives list of online players.",
    DMonly: false,
    async execute(message, args) {
        try {
            await connection.query("USE " + config.databaseCharacter);

            connection.query("SELECT name FROM characters WHERE online = 1", (error, results1) => {
                if (error) {
                    console.error("SQL Error:", error);
                    return message.reply("❌ An error occurred while retrieving online players.");
                }

                let onlinePlayers = results1.map(row => row.name);
                let counter = onlinePlayers.length;
                let description = counter > 0 ? onlinePlayers.join(", ") : "There is no one online.";

                const embed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle("Online Players")
                    .setDescription(description)
                    .addFields({ name: "Amount of characters online:", value: `${counter} characters` })
                    .setTimestamp()
                    .setFooter({ text: "Online command", iconURL: client.user?.displayAvatarURL() || "" });

                message.channel.send({ embeds: [embed] }).catch(console.error);
            });
        } catch (err) {
            console.error("Unexpected Error:", err);
        }
    },
};
