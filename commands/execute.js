const Discord = require("discord.js");
const config = require("../config.js");
const client = require("../server.js");
const soap = require("../soap.js");

module.exports = {
    name: "execute",
    description: "Execute any console acore command.",
    DMonly: true,

    async execute(message, args) {
        try {
            if (!args.length) {
                return message.reply(`You need to add text after the command.\nUsage: **${config.prefix}execute <command & params>**`);
            }

            const fullCommand = args.join(" ");

            await soap.Soap(`${fullCommand}`);

            const embed = new Discord.EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle("Execute Success")
                .setDescription("A direct console command has been sent.")
                .setTimestamp()
                .setFooter({ text: "Execute Command", iconURL: client.user.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Unexpected Error:", error);
            await message.channel.send("Internal Error.");
        }
    },
};
