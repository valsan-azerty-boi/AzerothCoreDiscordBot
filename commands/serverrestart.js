const Discord = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const soap = require("../soap.js");

module.exports = {
    name: "serverrestart",
    description: "Restart the world server.",
    DMonly: false,
    async execute(message, args) {
        if (!args[0]) {
            return message.reply(`You need to add a time param in seconds after the command.\nUsage: **!serverrestart <seconds>**`);
        }

        const timeInSeconds = parseInt(args[0], 10);
        if (isNaN(timeInSeconds) || timeInSeconds < 5 || timeInSeconds > 3600) {
            return message.reply(`Please provide a valid time in seconds (between 5 and 3600).`);
        }

        try {
            const result = await soap.Soap(`server restart ${timeInSeconds}`);

            console.log(result);
            if (result.faultString) {
                return message.reply(result.faultString);
            }

            const embed = new Discord.EmbedBuilder()
                .setColor(config.color)
                .setTitle("Server Restart Success")
                .setDescription("The server restarts soon.")
                .setTimestamp()
                .setFooter({ text: "Serverrestart Command", iconURL: client.user.displayAvatarURL() });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    },
};
