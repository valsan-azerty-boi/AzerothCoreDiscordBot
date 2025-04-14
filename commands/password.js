const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const db = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
    name: "password",
    description: "Changes an account password.",
    DMonly: true,

    async execute(message, args) {
        try {
            if (args.length < 2) {
                return message.reply(`Usage: **${config.prefix}password <username> <newpassword>**`);
            }

            const username = args[0];
            const newPassword = args[1];
            const results = await db.queryAuth("SELECT id AS accountId FROM account WHERE username = ?", [username]);

            if ((!results[0]?.accountId || results[0].accountId.length == 0)) {
                return message.reply("This account doesn't exist.");
            }

            await soap.Soap(`account set password ${username} ${newPassword} ${newPassword}`);

            const embed = new EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle("Password Changed")
                .setDescription("Your account credentials has been changed.")
                .addFields(
                    { name: "Username", value: username, inline: true },
                    { name: "Password", value: "*".repeat(newPassword.length), inline: true }
                )
                .setTimestamp()
                .setFooter({ text: "Password command", iconURL: client.user?.displayAvatarURL() || "" });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Unexpected Error: ", error);
            await message.channel.send("Internal Error.");
        }
    },
};
