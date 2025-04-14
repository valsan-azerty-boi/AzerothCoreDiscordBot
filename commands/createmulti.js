const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const db = require("../databasesql.js");
const soap = require("../soap.js");

module.exports = {
  name: "createmulti",
  description: "Creates multiple game accounts by appending a number to the given username.",
  DMonly: true,

  async execute(message, args) {
    if (!args[0] || isNaN(args[0])) {
      return message.reply(`Usage: **${config.prefix}createmulti <amount> <username> <password>**`);
    }
    if (!args[1]) {
      return message.reply(`You need to specify a username.\nUsage: **${config.prefix}createmulti <amount> <username> <password>**`);
    }
    if (!args[2]) {
      return message.reply(`You need to specify a password.\nUsage: **${config.prefix}createmulti <amount> <username> <password>**`);
    }
    if (args[2].length > 14) {
      return message.reply("Password must be less than 14 characters.");
    }

    const amount = parseInt(args[0]);
    const username = args[1];
    const password = args[2];

    try {
      const [results] = await db.queryAuth("SELECT COUNT(username) AS count FROM account WHERE username LIKE ?", [`${username}%`]);  
      const existingAccounts = results[0].count;

      if (existingAccounts < 25) {
        const embed = new EmbedBuilder()
          .setColor(config.color || "#00FF00")
          .setTitle("Accounts Created")
          .setDescription("Here are the details of your newly created accounts:")
          .setTimestamp()
          .setFooter({ text: "Createmulti Command", iconURL: client.user?.displayAvatarURL() || "" });

        for (let i = 1; i <= amount; i++) {
          const newUsername = `${username}${i}`;
          const result = await soap.Soap(`account create ${newUsername} ${password}`);

          if (result.faultString) {
            return message.reply(`Error creating ${newUsername}: ${result.faultString}`);
          }

          embed.addFields({ name: `${i}. Username | Password`, value: `${newUsername} | ${"*".repeat(newPassword.length)}`, inline: false });
        }

        await message.channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  },
};
//TODO: tests
