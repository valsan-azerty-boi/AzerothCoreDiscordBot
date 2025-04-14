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
                return message.reply(`You need to specify a character name.\nUsage: **${config.prefix}changefaction <charactername>**`);
            }

            const charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();

            await connection.query(`USE ${config.databaseCharacter}`);
            const [charResults] = await connection.query(
                "SELECT account FROM characters WHERE name = ?",
                [charName]
            );

            if (!charResults[0]) {
                return message.reply("Character doesn't exist!");
            }

            const accountId = charResults[0].account;

            await connection.query(`USE ${config.databaseAuth}`);
            const [accResults] = await connection.query(
                "SELECT id FROM account WHERE id = ?",
                [accountId]
            );

            if (!accResults[0]) {
                return message.reply("Couldn't find an account connected to the character.");
            }

            const result = await soap.Soap(`character changefaction ${charName}`);

            if (result.faultString) {
                return message.reply(`${result.faultString}`);
            }

            const embed = new EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle("Changefaction Success")
                .setDescription(`You can now change the faction of **${charName}** on your next login.`)
                .setTimestamp()
                .setFooter({ text: "Changefaction Command", iconURL: client.user.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error("Unexpected Error: ", err);
        }
    },
};
// TODO: tests 
