const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const connection = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
  name: "createmulti",
  description: "Creates multiple game accounts by appending a number to the given username.",
  DMonly: true,

  async execute(message, args) {
    if (!args[0] || isNaN(args[0])) {
      return message.reply("Usage: **!createmulti <amount> <username> <password>**");
    }
    if (!args[1]) {
      return message.reply("You need to specify a username.\nUsage: **!createmulti <amount> <username> <password>**");
    }
    if (!args[2]) {
      return message.reply("You need to specify a password.\nUsage: **!createmulti <amount> <username> <password>**");
    }
    if (args[2].length > 14) {
      return message.reply("Password must be less than 14 characters.");
    }

    const amount = parseInt(args[0]);
    const username = args[1];
    const password = args[2];

    try {
      await connection.query("USE " + config.databaseAuth);

      const [result] = await connection.query("SELECT COUNT(username) AS count FROM account WHERE reg_mail = ?", [message.author.id]);
      const existingAccounts = result[0].count;

      if (existingAccounts >= 25) {
        return message.reply("Error.");
      }

      const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle("Accounts Created")
        .setDescription("Here are the details of your newly created accounts:")
        .setTimestamp()
        .setFooter({ text: "Createmulti Command", iconURL: client.user?.displayAvatarURL() || "" });

      for (let i = 1; i <= amount; i++) {
        if (existingAccounts + i <= 25) {
          const newUsername = `${username}${i}`;
          const result = await soap.Soap(`account create ${newUsername} ${password}`);

          if (result.faultString) {
            return message.reply(`Error creating ${newUsername}: ${result.faultString}`);
          }

          await connection.query("UPDATE account SET reg_mail = ? WHERE username = ?", [message.author.id, newUsername]);
          embed.addFields({ name: `${i}. Username | Password`, value: `${newUsername} | ${password}`, inline: false });
        }
      }

      await message.channel.send({ embeds: [embed] });

    } catch (error) {
      console.error("Error: ", error);
    }
  },
};
//TODO: tests
