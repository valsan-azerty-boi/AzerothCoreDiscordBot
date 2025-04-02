const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const mysql = require("mysql2/promise");
const connection = mysql.createPool({
    host: config.databaseHost,
    user: config.databaseUser,
    password: config.databasePassword,
    database: config.databaseCharacter,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = {
    name: "online",
    description: "Gives total count of online players.",
    DMonly: false,
    async execute(message, args) {
        try {
            await connection.query("USE " + config.databaseCharacter);

            const [countResults] = await connection.query("SELECT COUNT(name) AS onlineCount FROM characters WHERE online = 1");
            const onlineCount = countResults[0].onlineCount;

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle("Online Players")
                .setDescription("Gives total count of online players")
                .addFields({ name: "Amount of characters online:", value: `${onlineCount}` })
                .setTimestamp()
                .setFooter({ text: "Online command", iconURL: client.user?.displayAvatarURL() || "" });

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error("Unexpected Error: ", err);
        }
    },
};
