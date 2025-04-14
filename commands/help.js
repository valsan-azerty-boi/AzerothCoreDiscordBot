const { EmbedBuilder } = require("discord.js");
const config = require("../config.js");

module.exports = {
    name: "help",
    description: "List all of my commands or info about a specific command.",
    DMonly: true,

    async execute(message, args) {
        try {
            const { commands } = message.client;

            if (!args.length) {
                const data = [
                    "Here's a list of all my commands:",
                    commands.map(command => `\`${command.name}\``).join(" | "),
                    `\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`
                ];

                const embed = new EmbedBuilder()
                    .setColor(config.color || "#00FF00")
                    .setTitle("Help - Command List")
                    .setDescription(data.join("\n"))
                    .setTimestamp()
                    .setFooter({ text: "Help Command", iconURL: message.client.user.displayAvatarURL() });

                await message.channel.send({ embeds: [embed] });
                return;
            }

            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
            if (!command) {
                return message.reply("That's not a valid command!");
            }

            const embed = new EmbedBuilder()
                .setColor(config.color || "#00FF00")
                .setTitle(`Command: ${command.name}`)
                .setDescription(command.description || "No description available.")
                .addFields(
                    { name: "Aliases", value: command.aliases ? command.aliases.join(", ") : "None", inline: true },
                    { name: "Usage", value: `\`${config.prefix}${command.name} ${command.usage || ""}\``, inline: true },
                    { name: "Cooldown", value: `${command.cooldown || 3} second(s)`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: "Help Command", iconURL: message.client.user.displayAvatarURL() });

            await message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error("Unexpected Error: ", error);
            await message.channel.send("Internal Error.");
        }
    },
};
