module.exports.run = async (client, message, args) => {
    let tgtav;
	let tgt = args[0];
	let ment = message.mentions.members.first();
	if(ment){
		tgtav = ment.id;
	} else if (isNaN(tgt) == false){
		tgtav = tgt
	} else {
		tgtav = message.author.id
	}
	client.users.fetch(tgtav).then(target => {
		let avembed = {
			title: `${target.username}#${target.discriminator}'s avatar`,
			color: client.embedcolor,
			footer: {
				text: `powered by ${client.powered}`
			},
			image: {
				url: target.avatarURL({dynamic: true})
			}
		};
		message.channel.send({embed: avembed});
	}).catch(err => {
		if(err.code == "10013"){
			let embed404 = {
				title: "Mekhane Avatar finder",
        		description: "Could not find user. Maybe double check?",
        		color: embedcolor,
       			footer: {
            		text: `powered by ${client.powered}`
				}
			}
			message.channel.send({embed: embed404});
		}
	});
};
    
module.exports.help = {
    name: 'avatar'
};