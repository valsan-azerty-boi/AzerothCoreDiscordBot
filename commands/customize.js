const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
    name: "customize",
    description: "Mark character for customize at next login.",
    DMonly: false,

    async execute(message, args) {
        if (!args[0]) {
            return message.reply("You need to add a character name after the command.\nUsage: **!customize <charactername>**");
        }

        const charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();

        try {
            await connection.query("USE " + config.databaseCharacter);
            const [results1] = await connection.query("SELECT account FROM characters WHERE name = ?", [charName]);

            if (!results1.length) {
                return message.reply("Character doesn't exist!");
            }

            const characterAccountId = results1[0].account;

            await connection.query("USE " + config.databaseAuth);
            const [results2] = await connection.query("SELECT id FROM account WHERE reg_mail = ? AND id = ?", [message.author.id, characterAccountId]);

            if (!results2.length) {
                return message.reply("Couldn't find account connected to the character.");
            }

            if (characterAccountId === results2[0].id) {
                const result = await soap.Soap(`character customize ${charName}`);

                if (result.faultString) {
                    return message.reply(result.faultString);
                }

                const embed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle("Customize Success")
                    .setDescription("You can customize the character at next login.")
                    .setTimestamp()
                    .setFooter({ text: "Customize Command", iconURL: client.user?.displayAvatarURL() || "" });

                await message.channel.send({ embeds: [embed] });
            } else {
                message.reply("The account bound to the character is not yours.");
            }
        } catch (error) {
            console.error("Unexpected Error: ", error);
        }
    },
};
//TODO: tests
