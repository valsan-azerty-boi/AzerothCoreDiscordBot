const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const db = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
    name: "customize",
    description: "Mark character for customize at next login.",
    DMonly: false,

    async execute(message, args) {
        try {
            if (!args[0]) {
                return message.reply(`You need to specify a character name.\nUsage: **${config.prefix}customize <charactername>**`);
            }

            const charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();
            const charResults = await db.queryCharacter("SELECT account FROM characters WHERE name = ?", [charName]);

            if (!charResults.length) {
                return message.reply("Character doesn't exist!");
            }

            const accountId = charResults[0].account;
            const accResults = await db.queryAuth(
                "SELECT id FROM account WHERE id = ?",
                [accountId]
            );

            if (!accResults[0]) {
                return message.reply("Couldn't find account connected to the character.");
            }

            await soap.Soap(`character customize ${charName}`);

            const embed = new EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle("Customize Success")
                .setDescription("You can customize the character at next login.")
                .setTimestamp()
                .setFooter({ text: "Customize Command", iconURL: client.user?.displayAvatarURL() || "" });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Unexpected Error:", error);
        }
    },
};
// TODO: tests
