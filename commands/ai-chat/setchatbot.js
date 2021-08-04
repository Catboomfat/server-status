const { checkPermission } = require('../../Permissions');
const { db } = require('../../Database.js');


module.exports = {
	config: {
		name: 'set-chatbot-channel',
		aliases: ['set-chatbot'],
		category: "admin",
		description: 'Sets chatbot channel',
		usage: 'set"chatbot'
	},
	run: async (bot, message, args) => {
       
            /****   Checking Permissions    ****/
            let botPermission = await checkPermission('bot', message, [
                'MANAGE_GUILD',
            ]);
            if(botPermission) return 

            let memberPermission = await checkPermission('member', message, [
                'MANAGE_GUILD',
            ])
            if(memberPermission) return;

            /****  Regular Code   ****/
            if(!args[0]) {

                const b = await db.fetch(`chatbot_${message.guild.id}`)
                const channelName =  message.guild.channels.cache.get(b);
                
                if(message.guild.channels.cache.has(b)) {
                        return message.channel.send(`**✅ ChatBot Channel Set In This Server Is \`${channelName.name}\`!**`);
                } else {
                    return message.channel.send({embed: {
                        color: config.embedcolor,
                        title: `${emotes.error} Please Enter a Channel or Channel ID to set`
                    }});
                };
            };

            let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.join(' ').toLocaleLowerCase());

            if(!channel || channel.type !== 'text') return message.channel.send({embed: {
                color: '#F8B6D4',
                title: `❌ Please enter a Valid Channel!`
            }});

            try {
                let a = await db.fetch(`chatbot_${message.guild.id}`);
        
                if (channel.id === a) {
                    return message.channel.send({embed: {
                    color: `#F8B6D4`,
                    title: `❌ This Channel is already set as ChatBot Channel!`
                }});
                } else {
                    bot.guilds.cache.get(message.guild.id).channels.cache.get(channel.id).send(`**✅ ChatBot Channel Set!**`);
                    db.set(`chatbot_${message.guild.id}`, channel.id);

                  message.channel.send({embed: {
                    color: '#F8B6D4',
                    title: `✅ ChatBot Channel has been Set Successfully \`${channel.id}\``
                }});
                };

            } catch(error) {
                console.log(error);
            }
    },
};