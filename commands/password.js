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
        if (!args[0]) return message.reply("You need to add a username after the command. \nUsage: **!password <username> <newpassword>**");
        if (!args[1]) return message.reply("You need to add a new password after the username. \nUsage: **!password <username> <newpassword>**");

        let username = args[0];
        let password = args[1];

        try {
            const [results] = await connection.query("SELECT EXISTS(SELECT id FROM account WHERE reg_mail = ? AND username = ?)", [message.author.id, username]);

            if (Object.values(results[0])[0] === 1) {
                const result = await soap.Soap(`account set password ${username} ${password} ${password}`);

                console.log(result);
                if (result.faultString) return message.reply("Error.");

                const embed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle("Password changed")
                    .setDescription("Take a look at your new account info below:")
                    .addFields(
                        { name: "Username", value: username, inline: true },
                        { name: "Password", value: password, inline: true }
                    )
                    .setTimestamp()
                    .setFooter({ text: "Password command", iconURL: client.user?.displayAvatarURL() || "" });

                await message.channel.send({ embeds: [embed] });
            } else {
                message.reply("This username doesn't exist or you do not own the account.");
            }
        } catch (error) {
            console.error("Unexpected Error: ", error);
        }
    },
};
