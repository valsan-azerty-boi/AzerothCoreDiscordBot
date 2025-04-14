const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const db = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
    name: "create",
    description: "Creates a new game account.",
    DMonly: true,

    async execute(message, args) {
        try {
            if (!args[0] || !args[1]) {
                return message.reply(`Usage: **${config.prefix}create <username> <password>**`);
            }

            const username = args[0];
            const password = args[1];
            const [results] = await db.queryAuth("SELECT COUNT(username) AS accountCount FROM account WHERE username = ?", [username]);

            if (results[0].accountCount >= 1) {
                return message.reply("Account already exists.");
            }

            await soap.Soap(`account create ${username} ${password}`);

            const embed = new EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle("Account Created")
                .setDescription("The account has been successfully created.")
                .addFields(
                    { name: "Username", value: username, inline: true },
                    { name: "Password", value: "*".repeat(password.length), inline: true }
                )
                .setTimestamp()
                .setFooter({ text: "Create command", iconURL: client.user?.displayAvatarURL() || "" });

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error("Unexpected Error: ", err);
        }
    },
};
// TODO: tests
