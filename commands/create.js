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
            const [results] = await db.queryAuth("SELECT COUNT(username) AS count FROM account WHERE username LIKE ?", [`${username}%`]);  

            if (results[0].accountCount >= 25) {
                return message.reply("You can only have up to 25 accounts associated with your email.");
            }

            try {
                const result = await soap.Soap(`account create ${username} ${password}`);
                if (result.faultString) {
                    return message.reply("Username already exists.");
                }

                const embed = new EmbedBuilder()
                    .setColor(config.color || "#00FF00")
                    .setTitle("Account Created")
                    .setDescription("The account has been successfully created.")
                    .addFields(
                        { name: "Username", value: username, inline: true },
                        { name: "Password", value: "*".repeat(newPassword.length), inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: "Create command", iconURL: client.user?.displayAvatarURL() || "" });

                await message.channel.send({ embeds: [embed] });
            } catch (soapError) {
                console.error("SOAP Error: ", soapError);
            }
        } catch (err) {
            console.error("Unexpected Error: ", err);
        }
    },
};
// TODO: tests
