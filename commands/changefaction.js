const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
    name: "changefaction",
    description: "Change the faction of a character.",
    DMonly: false,
    async execute(message, args) {
        try {
            if (!args[0]) {
                return message.reply("You need to specify a character name.\nUsage: **!changefaction <charactername>**");
            }

            let charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();

            await connection.query("USE " + config.databaseCharacter);
            connection.query("SELECT account FROM characters WHERE name = ?", [charName], (error, results1) => {
                if (error) {
                    console.error("SQL Error: ", error);
                }
                if (!results1[0]) {
                    return message.reply("Character doesn't exist!");
                }

                connection.query("USE " + config.databaseAuth);
                connection.query("SELECT id FROM account WHERE reg_mail = ? AND id = ?", [message.author.id, accountId], async (error, results2) => {
                    if (error) {
                        console.error("SQL Error: ", error);
                    }
                    if (!results2 || !results2[0]) {
                        return message.reply("Couldn't find an account connected to the character.");
                    }

                    try {
                        const result = await soap.Soap(`character changefaction ${charName}`);

                        if (result.faultString) {
                            return message.reply(`${result.faultString}`);
                        }

                        const embed = new EmbedBuilder()
                            .setColor(config.color)
                            .setTitle("Changefaction Success")
                            .setDescription("You can now change the faction of this character.")
                            .setTimestamp()
                            .setFooter({ text: "Changefaction Command", iconURL: client.user.displayAvatarURL() });

                        message.channel.send({ embeds: [embed] }).catch(console.error);
                    } catch (soapError) {
                        console.error("SOAP Error: ", soapError);
                    }
                });
            });
        } catch (err) {
            console.error("Unexpected Error: ", err);
        }
    },
};
// TODO: tests 
