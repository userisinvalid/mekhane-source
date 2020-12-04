module.exports.run = async (client, message, args) => {
    let biggay = args.join(" ");
	if(biggay.includes("<@&") || biggay.includes("@everyone") || biggay.includes("@here")) {
		message.channel.send("Don't try to mention everyone with the bot. Continue and a warning will be issued.")
	} else {
		if(biggay){
			message.channel.send(`${biggay} is hella gay!`);
		} else {
			message.channel.send("Please use something to call hella gay.")
		}
	}
};
    
module.exports.help = {
    name: 'hellagay'
};