const Discord = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const soap = require("../soap.js");

module.exports = {
    name: "announce",
    description: "Create an instant announce.",
    DMonly: true,

    async execute(message, args) {
        try {
            if (!args.length) {
                return message.reply(`You need to add text after the command.\nUsage: **${config.prefix}announce <text>**`);
            }

            const announce = args.join(" ");

            await soap.Soap(`announce ${announce}`);

            const embed = new Discord.EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle("Announce Success")
                .setDescription("An announce has been sent.")
                .setTimestamp()
                .setFooter({ text: "Announce Command", iconURL: client.user.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Unexpected Error:", error);
            await message.channel.send("Internal Error.");
        }
    },
};
