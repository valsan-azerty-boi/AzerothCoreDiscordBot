const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");

module.exports = {
    name: "online",
    description: "Gives list of online players.",
    DMonly: false,
    execute(message, args) {
        connection.query("USE acore_characters");

        connection.query("SELECT name FROM characters WHERE online = 1", (error, results1) => {
            if (error) {
                console.error("Erreur SQL:", error);
                return message.reply("❌ Une erreur s'est produite lors de la récupération des joueurs en ligne.");
            }

            let onlinePlayers = [];
            if (results1 && results1.length > 0) {
                results1.forEach(row => onlinePlayers.push(row.name));
            }

            const counter = onlinePlayers.length;
            const description = counter > 0 ? onlinePlayers.join(", ") : "There is no one online.";

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle("Online Players")
                .setDescription(description)
                .addFields({ name: "Amount of characters online:", value: `${counter} characters` })
                .setTimestamp()
                .setFooter({ text: "Online command", iconURL: client.user.displayAvatarURL() });

            message.channel.send({ embeds: [embed] });
        });
    },
};
