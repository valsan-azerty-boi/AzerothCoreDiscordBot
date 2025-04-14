const { EmbedBuilder } = require("discord.js");
const config = require('../config.js');
const client = require('../server.js');
const db = require('../databasesql.js');
const soap = require("../soap.js");

module.exports = {
  name: 'unstuck',
  description: 'Unstucks your character.',
  DMonly: true,

  async execute(message, args) {
    try {
      if (!args[0]) {
        return message.reply(`You need to add a character name after the command.\nUsage: **${config.prefix}unstuck <charactername>**`);
      }

      const charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();
      const accountChar = await db.queryCharacter("SELECT account FROM characters WHERE name = ?", [charName]);

      if (!accountChar.length) {
        return message.reply("Character doesn't exist!");
      }

      const characterAccountId = accountChar[0].account;
      const accountVerify = await db.queryAuth("SELECT id FROM account WHERE id = ?", [characterAccountId]);

      if (!accountVerify.length) {
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
    } catch (error) {
      console.error("Unexpected Error:", error);
      await message.channel.send("Internal Error.");
    }
  },
};
