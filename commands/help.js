const { EmbedBuilder } = require("discord.js");
const config = require('../config.js');
const connection = require('../databasesql.js');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    DMonly: false,
    async execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(' | '));
            data.push(`\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`);

            try {
                await message.author.send({ content: data.join('\n'), split: true });
                if (message.channel.type !== 'DM') {
                    await message.reply('I\'ve sent you a DM with all my commands!');
                }
            } catch (error) {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
            }
            return;
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('That\'s not a valid command!');
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff') // You can customize the color
            .setTitle(`Command: ${command.name}`)
            .setDescription(command.description || 'No description available.')
            .addFields(
                { name: 'Aliases', value: command.aliases ? command.aliases.join(', ') : 'None', inline: true },
                { name: 'Usage', value: `${config.prefix}${command.name} ${command.usage || ''}`, inline: true },
                { name: 'Cooldown', value: `${command.cooldown || 3} second(s)`, inline: true }
            )
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
