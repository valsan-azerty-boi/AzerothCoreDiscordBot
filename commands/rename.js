const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
    name: "rename",
    description: "Mark character for rename at next login.",
    DMonly: false,
    async execute(message, args) {
        if (!args[0]) return message.reply("You need to add a character name after the command. \nUsage: **!rename <charactername>**");

        let charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();

        try {
            await connection.query("USE " + config.databaseCharacter);
            const [results1] = await connection.query("SELECT account FROM characters WHERE name = ?", [charName]);

            if (!results1[0]) return message.reply("Character doesn't exist!");

            await connection.query("USE " + config.databaseAuth);
            const [results2] = await connection.query("SELECT id FROM account WHERE reg_mail = ? AND id = ?", [message.author.id, results1[0].account]);

            if (!results2 || !results2[0]) return message.reply("Couldn't find account connected to the character.");

            if (Object.values(results1[0])[0] === Object.values(results2[0])[0]) {
                const result = await soap.Soap(`character rename ${charName}`);

                console.log(result);
                if (result.faultString) return message.reply(result.faultString);

                const embed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle("Rename Success")
                    .setDescription("You can rename the character at next login.")
                    .setTimestamp()
                    .setFooter({ text: "Rename Command", iconURL: client.user?.displayAvatarURL() || "" });

                await message.channel.send({ embeds: [embed] });
            } else {
                message.reply("The account bound to the character is not yours.");
            }
        } catch (error) {
            console.error("Unexpected Error: ", error);
        }
    },
};
