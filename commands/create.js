const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
    name: "create",
    description: "Creates a new game account.",
    DMonly: true,

    async execute(message, args) {
        try {
            if (!args[0] || !args[1]) {
                return message.reply("Usage: **!create <username> <password>**");
            }

            const username = args[0];
            const password = args[1];

            await connection.query("USE " + config.databaseAuth);

            connection.query("SELECT COUNT(username) AS accountCount FROM account WHERE reg_mail = ?", [message.author.id], async (error, results) => {
                if (error) {
                    console.error("SQL Error: ", error);
                }

                if (results[0].accountCount <= 25) {
                    try {
                        const result = await soap.Soap(`account create ${username} ${password}`);

                        if (result.faultString) {
                            return message.reply("Username already exists.");
                        }

                        connection.query("UPDATE account SET reg_mail = ? WHERE username = ?", [message.author.id, username]);

                        const embed = new EmbedBuilder()
                            .setColor(config.color)
                            .setTitle("Account Created")
                            .setDescription("The account has been successfully created.")
                            .addFields(
                                { name: "Username", value: username, inline: true },
                                { name: "Password", value: password, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: "Create command", iconURL: client.user?.displayAvatarURL() || "" });

                        message.channel.send({ embeds: [embed] }).catch(console.error);
                    } catch (soapError) {
                        console.error("SOAP Error: ", soapError);
                    }
                }
            });
        } catch (err) {
            console.error("Unexpected Error: ", err);
        }
    },
};
// TODO: tests
