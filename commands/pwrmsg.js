module.exports.run = async (client, message, args) => {
    let pwr = args.join(" ");
	if(client.config.whitelist.includes(message.author.id)) {
		if(pwr) {
			client.powered = pwr;
			message.channel.send("\`EMBED FOOTER MESSAGE UPDATED\`");
			message.delete();
		} else {
			message.channel.send("\`MESSAGE CANNOT BE EMPTY\`")
			message.delete();
		}
	}
};
    
module.exports.help = {
    name: 'pwrmsg'
};