const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const mysql = require("mysql2/promise");
const connection = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.databaseCharacter,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    name: "online",
    description: "Gives list of online players.",
    DMonly: false,
    async execute(message, args) {
        try {
            await connection.query("USE " + config.databaseCharacter);

            const [results1] = await connection.query("SELECT name FROM characters WHERE online = 1");

            let onlinePlayers = results1.map(row => row.name);
            let counter = onlinePlayers.length;
            let description = counter > 0 ? onlinePlayers.join(", ") : "There is no one online.";

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle("Online Players")
                .setDescription(description)
                .addFields({ name: "Amount of characters online:", value: `${counter} characters` }) // Fixed template literal
                .setTimestamp()
                .setFooter({ text: "Online command", iconURL: client.user?.displayAvatarURL() || "" });

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error("Unexpected Error:", err);
        }
    },
};
