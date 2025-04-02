const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
    name: "password",
    description: "Changes an account password.",
    DMonly: true,

    async execute(message, args) {
        if (args.length < 2) {
            return message.reply("Usage: **!password <username> <newpassword>**");
        }

        const [username, password] = args;

        try {
            const [results] = await connection.query(
                "SELECT id FROM account WHERE reg_mail = ? AND username = ?",
                [message.author.id, username]
            );

            if (!results.length) {
                return message.reply("This account doesn't exist or you do not own the account.");
            }

            const result = await soap.Soap(`account set password ${username} ${password} ${password}`);

            if (result.faultString) {
                return message.reply("Error occurred while changing the password.");
            }

            const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle("Password Changed")
                .setDescription("Take a look at your new account credentials:")
                .addFields(
                    { name: "Username", value: username, inline: true },
                    { name: "Password", value: password, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: "Password command", iconURL: client.user?.displayAvatarURL() || "" });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Unexpected Error: ", error);
        }
    },
};
//TODO: tests
