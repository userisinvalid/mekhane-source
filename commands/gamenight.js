module.exports.run = async (client, message, args) => {
    let auth = message.member.roles.cache;
	if(!(auth.has("AUTH-ID-1") || auth.has("AUTH-ID-2"))) return; // does the caller have authorization? you can add your own role IDs
	
	let gnm = args.join(" ")
	let gncache = client.guilds.cache.get(client.config.server_id).channels.cache // the channels
	let gnchat = gncache.get("GN-CHAT-ID") // gamenight chat
	let gncn = gncache.get("GN-ANN-ID") // gamenight announcement chat
	if(!gnm){
		message.channel.send("Please include your gamenight message.")
	} else if (args.join(" ") == "end") {
		if(!latest){
			message.channel.send("No gamenight message found.")
			return
		}
		message.delete()
		latest.delete()
		message.channel.send(`Gamenight ended by ${message.author.username}#${message.author.discriminator}`)
		gnchat.overwritePermissions([{id:client.config.verified_role, deny:["SEND_MESSAGES"]}])
	} else {
		message.delete();
		gncn.send(`<@&${client.config.gamenight_role}> ${gnm}`).then(msg => latest = msg)
		gnchat.overwritePermissions([{id:client.config.verified_role, allow:["SEND_MESSAGES"]}])
		message.channel.send(`Gamenight started by ${message.author.username}#${message.author.discriminator}`)
	}
};
    
module.exports.help = {
    name: 'gamenight'
};