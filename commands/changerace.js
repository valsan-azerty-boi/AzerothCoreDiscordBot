const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
  name: "changerace",
  description: "Change character race.",
  DMonly: false,

  async execute(message, args) {
    try {
      if (!args[0]) {
        return message.reply("You need to add a character name after the command.\nUsage: **!changerace <charactername>**");
      }

      let charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();

      await connection.query("USE " + config.databaseCharacter);
      connection.query("SELECT account FROM characters WHERE name = ?", [charName], async (error, results1) => {
        if (error) {
          console.error("SQL Error: ", error);
          return;
        }

        if (!results1[0]) {
          return message.reply("Character doesn't exist!");
        }

        await connection.query("USE " + config.databaseAuth);

        connection.query("SELECT id FROM account WHERE reg_mail = ? AND id = ?", [message.author.id, characterAccountId], async (error, results2) => {
          if (error) {
            console.error("SQL Error: ", error);
            return;
          }

          if (!results2[0]) {
            return message.reply("Couldn't find account connected to the character.");
          }

          if (Object.values(results1[0])[0] === Object.values(results2[0])[0]) {
            try {
              const result = await soap.Soap(`character changerace ${charName}`);

              if (result.faultString) {
                return message.reply(result.faultString);
              }

              const embed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle("Changerace Success")
                .setDescription("You can now change the race of your character.")
                .setTimestamp()
                .setFooter({ text: "Changerace Command", iconURL: client.user?.displayAvatarURL() || "" });

              message.channel.send({ embeds: [embed] }).catch(console.error);
            } catch (soapError) {
              console.error("SOAP Error: ", soapError);
            }
          }
        });
      });
    } catch (err) {
      console.error("Unexpected Error: ", err);
    }
  },
};
// TODO: tests
