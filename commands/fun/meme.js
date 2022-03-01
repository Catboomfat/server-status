/* 
* Comfi Bot for Discord 
* Copyright (C) 2021 Xx-Mohit-xX
* This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International 
* For more information, see README.md and LICENSE 
*/

const { MessageEmbed, CommandInteraction } = require('discord.js');
const fetch = require('node-fetch')

module.exports = {
    name: 'meme',
    description: 'Get a random meme from reddit',
  directory: "fun",
    ownerOnly: false,
    userperm: [""],
    botperm: [""],
  /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    run: async(bot, interaction, args) => {

try {
      
        await fetch('http://meme-api.herokuapp.com/gimme/memes')
        .then(response => response.json())
        .then(async(r) => {
            const embed = new MessageEmbed()
            .setImage(`${r.url}`)
            .setTitle(`${r.title}`)
            .setURL(`${r.postLink}`)
            .setColor(bot.color)
            .setFooter(`🔼 ${r.ups} | Author: ${r.author}`)

await interaction.editReply({embeds: [embed]}).catch((e) => {
        bot.sendhook(
          `Error Occured \n ${e.stack}`
        ), {
          channel: bot.err_chnl
        } 
        interaction.followUp({
          content: `${bot.error} Error, try again later \n Error: ${e} \n [Contact Support](https://comfibot.tk/discord) `,
          ephemeral: true
        });
        }) 
    })

} catch (e) {
			let emed = new MessageEmbed()
				.setTitle(`${bot.error} • Error Occured`)
				.setDescription(`\`\`\`${e.stack}\`\`\``)
				.setColor(bot.color)

			bot.sendhook(null, {
				channel: bot.err_chnl,
				embed: emed
			})

			interaction.followUp({
				embeds: [
					{
						description: `${
							bot.error
						} Error, try again later \n Error: ${e} \n [Contact Support](https://comfibot.tk/discord) `,
						color: bot.color
					}
				]
			})
}
  
}
}