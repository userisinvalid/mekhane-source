const request = require("request");

module.exports.run = async (client, message, args) => {
    let them = args.join(" ");
		let mnt = message.mentions.members.first();
		if(mnt){
			them = mnt.id;
		} else if (!them){
			message.channel.send("Please insert a valid user.");
			return
		}
		request({ 
			method: 'GET', 
			uri: `https://verify.eryn.io/api/user/${them}`
		}, 
		function (error, response, body) {
			let rbxid = client.tryParseJSON(body);
			if(rbxid == false){
				message.channel.send("Something went wrong. Try again.")
				return
			} else if(rbxid.status == "ok") {
				request({ 
					method: 'GET', 
					uri: `https://users.roblox.com/v1/users/${rbxid.robloxId}`
				}, 
				function (error, response, body) {
				let whom = JSON.parse(body);
				let date = new Date(whom.created);
				let year = date.getFullYear();
				let month = date.getMonth()+1;
				let dt = date.getDate();
				if (dt < 10) {
  					dt = '0' + dt;
				}
				if (month < 10) {
  					month = '0' + month;
				}
				client.users.fetch(them).then(ftchtgt => {
					let whoisembed = {
						title: whom.displayName,
						url: `https://www.roblox.com/users/${rbxid.robloxId}/profile`,
						description: whom.description,
						color: client.embedcolor,
						author: {
							name: `${ftchtgt.username}#${ftchtgt.discriminator}`,
							icon_url: ftchtgt.avatarURL
						},
						footer: {
							text: `powered by ${client.powered}`
						},
						thumbnail: {
							url: `https://assetgame.roblox.com/Thumbs/Avatar.ashx?username=${rbxid.robloxUsername}`
						},
						fields: [
							{
								name: "Date of creation",
								value: dt +'/'+ month +'/'+ year,
							}
						]
					};
					message.channel.send({embed: whoisembed})
				})
			})} else {
				let embed404 = {
					title: "Mekhane Account finder",
        			description: "Error: Account doesn't seem to be linked.",
        			color: client.embedcolor,
       				footer: {
            			text: `powered by ${client.powered}`
					}
				}
				message.channel.send({embed: embed404});
			}
		});
};
    
module.exports.help = {
    name: 'whois'
};