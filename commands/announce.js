const Discord = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const soap = require("../soap.js");

module.exports = {
    name: "announce",
    description: "Create an instant announce.",
    DMonly: false,
    async execute(message, args) {
        try {
            if (!args[0]) {
                return message.reply(`You need to add a text param in seconds after the command.\nUsage: **${config.prefix}announce <text>**`);
            }

            const announce = SomethingToDo;

            await soap.Soap(`announce ${announce}`);

            const embed = new Discord.EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle("Announce Success")
                .setDescription("An announce has been sent.")
                .setTimestamp()
                .setFooter({ text: "Announce Command", iconURL: client.user.displayAvatarURL() });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
        }
    },
};
//TODO: fix & tests
