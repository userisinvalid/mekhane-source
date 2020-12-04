module.exports.run = async (client, message, args) => {
    let msg = args.join(" ");
	if(client.config.whitelist.includes(message.author.id)) {
		if(msg) {
			client.user.setActivity(client.help + msg);
			message.channel.send("\`PLAY MESSAGE UPDATED\`");
			message.delete();
		} else {
			message.channel.send("\`MESSAGE CANNOT BE EMPTY\`")
			message.delete()
		}
	}
};
    
module.exports.help = {
    name: 'playmsg'
};