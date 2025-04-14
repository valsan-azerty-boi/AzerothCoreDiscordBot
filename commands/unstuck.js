const { EmbedBuilder } = require("discord.js");
const config = require('../config.js');
const client = require('../server.js');
const db = require('../databasesql.js');
const soap = require("../soap.js");

module.exports = {
  name: 'unstuck',
  description: 'Unstucks your character.',
  DMonly: false,

  async execute(message, args) {
    try {
      if (!args[0]) {
        return message.reply(`You need to add a character name after the command.\nUsage: **${config.prefix}unstuck <charactername>**`);
      }

      const charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();

      db.queryCharacter("SELECT account FROM characters WHERE name = ?", [charName], (err1, results1) => {
        if (err1) {
          console.error(err1);
          return message.reply("Error while fetching character.");
        }

        if (!results1 || !results1[0]) {
          return message.reply("Character doesn't exist!");
        }

        const characterAccountId = results1[0].account;
        db.queryAuth("SELECT id FROM account WHERE id = ?", [characterAccountId], async (err2, results2) => {

          if (err2) {
            console.error(err2);
            return message.reply("Error while verifying account.");
          }

          if (!results2 || !results2[0]) {
            return message.reply("Couldn't find account connected to the character.");
          }

          await soap.Soap(`unstuck ${charName}`);

          const embed = new EmbedBuilder()
            .setColor(config.color || "#00FF00")
            .setTitle("Unstuck Success")
            .setDescription(`Character **${charName}** is now unstuck.`)
            .setTimestamp()
            .setFooter({ text: "Unstuck Command", iconURL: client.user.displayAvatarURL() });

          await message.channel.send({ embeds: [embed] });
        });
      });
    } catch (error) {
      console.error("Unexpected Error:", error);
    }
  },
};
