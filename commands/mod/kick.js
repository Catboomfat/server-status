const { Interaction, MessageEmbed } = require('discord.js')
const guilds = require('../../models/guild')

module.exports = {
	name: 'kick',
	description: 'Kick Someone',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'user',
			description: 'User To Kick',
			type: "USER",
			required: true
		},
		{
			name: 'reason',
			description: 'Reason To Kick',
			type: "STRING",
			required: false
		}
	],
	userperm: ['KICK_MEMBERS'],
	botperm: ['KICK_MEMBERS'],
	/**
	 *
	 * @param {Interaction} interaction
	 */
	run: async (bot, interaction, args) => {
		try {
			// NOW lets get the user from options
			const options = interaction.options._hoistedOptions

			const user = interaction.options.getMember("user")
			const reason =
				options.find(e => e.name === 'reason') ||
				`Kicked by ${interaction.member.displayName}`

			var kickMember = interaction.guild.members.cache.get(args[0]) || user

			const userRank = user.member.roles.highest.rawPosition
			const memberRank = interaction.member.roles.highest.rawPosition

			if (!kickMember)
				return interaction.editReply('**User Is Not In The Guild!**')

			if (kickMember === interaction.member)
				return interaction.editReply(
					'${bot.crosss} • **You Cannot Kick Yourself!**'
				)
			if (userRank >= memberRank) {
				return interaction.editReply(
					`${
						bot.crosss
					} • **You can\'t kick this member due to your role being lower than that member role.**`
				)
			}

			if (kickMember.kickable) {
				const sembed2 = new MessageEmbed()
					.setColor(bot.color)
					.setDescription(
						`**You Have Been Kicked From ${
							interaction.guild.name
						} for - ${reason || 'No Reason!'}**`
					)
					.setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
				await kickMember.send({ embeds: [sembed2] }).catch(() => null)
				kickMember.kick()
			} else {
				return interaction.editReply(
					`${
						bot.crosss
					} • **I can\'t kick this user make sure that the users role is lower than my role.**`
				)
			}
			if (reason) {
				var sembed = new MessageEmbed()
					.setColor(bot.color)
					.setDescription(
						`**${kickMember.user.username}** has been kicked for ${reason}`
					)
				await interaction.editReply({ embeds: [sembed] })
			} else {
				var sembed2 = new MessageEmbed()
					.setColor(bot.color)
					.setDescription(`**${kickMember.user.username}** has been kicked`)
				await interaction.editReply({ embeds: [sembed2] }).catch(() => null)
			}
			const guild = await guilds.findOne({ guildId: interaction.guild.id })
			if (!guild.modlog) return;

			if (guild.modlog) {
				let channel = interaction.guild.channels.cache.find(
					c => c.id === guild.mod_channel
				)
				if (!channel) return;

				const embed = new MessageEmbed()
					.setAuthor({
name:						`${interaction.guild.name} Modlogs`,
iconURL:						interaction.guild.iconURL()
            })
					.setColor(bot.color)
					.setThumbnail(kickMember.user.displayAvatarURL({ dynamic: true }))
					.setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()})
					.addField('**Moderation**', 'kick')
					.addField('**User Kicked**', kickMember.user.username.toString())
					.addField('**Kicked By**', interaction.user.username)
					.addField('**Reason**', `${reason || '**No Reason**'}`)
					.addField('**Date**', interaction.createdAt.toString())
					.setTimestamp()

				var sChannel = interaction.guild.channels.cache.get(channel)
				if (!sChannel) return
				sChannel.send({ embeds: [embed] })
			}
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
