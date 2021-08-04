const { checkPermission } = require('../../Permissions');
const { db } = require('../../Database.js');


module.exports = {
	config: {
		name: 'disablechatbotchannel',
		aliases: [''],
		category: "admin",
		description: 'Disable Chatbot Channel',
		usage: 'disablechatbotchannel'
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

            try {

                let a = db.fetch(`chatbot_${message.guild.id}`);

                if(!a) {
                    return message.channel.send({embed: {
                        color: '#F8B6D4',
                        title: `❌ There is no Chatbot channel to disable!`
                    }});
                } else {

                    let channel = message.guild.channels.cache.get(a);
                    db.delete(`chatbot_${message.guild.id}`);

                    message.channel.send({embed: {
                        color: '#F8B6D4',
                        title: `✅ Chatbot Channel has been succesfully disabled!`
                    }});
                } return;
                
            } catch(err) {
            console.log(err);
            }
    }
}