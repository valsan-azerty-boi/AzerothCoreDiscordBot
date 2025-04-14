const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const db = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
  name: "changerace",
  description: "Change character race.",
  DMonly: false,

  async execute(message, args) {
    try {
      if (!args[0]) {
        return message.reply(`You need to specify a character name.\nUsage: **${config.prefix}changerace <charactername>**`);
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

      const result = await soap.Soap(`character changerace ${charName}`);

      if (result.faultString) {
        return message.reply(result.faultString);
      }

      const embed = new EmbedBuilder()
        .setColor(config.color || "#00FF00")
        .setTitle("Changerace Success")
        .setDescription("You can now change the race of your character.")
        .setTimestamp()
        .setFooter({ text: "Changerace Command", iconURL: client.user?.displayAvatarURL() || "" });

      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("Unexpected Error:", err);
    }
  },
};
// TODO: tests
