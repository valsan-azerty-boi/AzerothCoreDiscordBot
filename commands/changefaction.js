//TODO fix for latest version

const Discord = require("discord.js")
const config = require('../config.js')
const client = require('../server.js')
const crypto = require('crypto')
const connection = require('../databasesql.js');
const soap = require("../soap.js");
module.exports = {
	name: 'changefaction',
	description: 'Change faction of your character.',
    DMonly: false,
	execute(message, args) {
    if(!args[0]) return message.reply(`You need to add a character name after the command. \nUsage: **!changefaction <charactername>**`)
    let charName = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase();
    connection.query('USE ' + config.databaseCharacter)
      connection.query('select account from characters where name = ?', [charName], (error, results1, fields) => {
        if(!results1[0]) return message.reply(`Character doesn't exist!`)
        if (error) return console.log(error)
        connection.query('USE ' + config.databaseAuth)
        connection.query('select id from account where reg_mail = ? AND id = ?', [message.author.id, results1[0].account], (error, results2, fields) => {
          if(results2) console.log(results2)
          if(!results2 || !results2[0]) return message.reply(`Couldn't find account connected to the character.`)
            if (error) return message.reply('An error occured.')
            console.log(results2[0])
            
        if (Object.values(results1[0])[0] === Object.values(results2[0])[0]) { 

              try {
              soap.Soap(`character changefaction ${charName}`)
              .then(result => { 

                console.log(result)
                if(result.faultString) return message.reply(result.faultString) 
            

                    const embed = new Discord.MessageEmbed()
                    .setColor(config.color)
                    .setTitle('Changefaction Success')
                    .setDescription('You can now change the faction of your character.')
                    .setTimestamp()
                    .setFooter('Changefaction Command', client.user.displayAvatarURL());
            
                  message.channel.send(embed);

                })
              } catch (error) {
                console.log(error)
              }
            } else {
              message.reply('The account bound to the character is not yours.')
            }
        })
    })
          
	},
};