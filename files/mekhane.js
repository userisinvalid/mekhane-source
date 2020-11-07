/*

	The source code for this bot is unoptimized and sometimes unstable. Use and modify at your own risk. 
	Some IDs need to be changed for the bot to work, please check very carefully before starting.
	
	Check the data.json and config.json files before starting. Place your bot token in config.json and set a prefix.

*/
const Discord = require("discord.js");
const request = require("request");
const config = require("./config.json");
const embedcolor = 13376265;
const silserv = "SERV-ID"; // your server ID
const devserv = "DEV-ID"; // for dev builds
const owner = "BOT-OWNER"; // your user ID
const client = new Discord.Client();
const data = require("./data.json");
const gnid = "GN-ROLE-ID"; //gamenight role ID
const vid = "VER-ROLE-ID"; //verified ID 
const nicknames = ["bonk", "bruh", "NO SPECIAL CHARACTERS", "edgelord", "meme thief", "cringe deluxe", "gen rule 7", "stupid", "standard name", "nickname", "generic preset"]; //add your own if you want
var powered = "stale memes"
var latest; //stores the latest gamenight message

const help = `${config.prefixes.mekhane}help | `;
var fmsg = help + "wear a mask";


function banfind(str){ //helps with scriptbans
    let chk = data.mekhane.scriptbans
    if(chk.includes(str)){
        return true
    } else {
        return false
    }
}

function tryParseJSON(jsonString){ //used for whois, doesn't work without it sometimes
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }
    return false;
};

function specialname(input){ //checks if a name is nonstandard
	let nick = input
	let nonstandard = nick.replace(/[\w-]/g, "")
	if(nonstandard.length >= nick.length/2){ //check if half or more of the name is special
		return true
	} else {
		return false
	}
}

function verify(discid, chanid) { //verifies discord and roblox through eryn
	request({ 
		method: 'GET', 
		uri: `https://verify.eryn.io/api/user/${discid}`
		}, 
		function (error, response, body) { 	
			let x = tryParseJSON(body);
			if(x != false){
				if(x.status == "ok"){
					client.guilds.cache.get(silserv).members.cache.get(discid).roles.add(vid)
					let vermsg = {
						title: "Mekhane Verification",
						description: `Verified as ${x.robloxUsername}`,
						color: embedcolor,
						footer: {
							text: `powered by ${powered}`
						}
					};
					client.users.cache.get(discid).createDM().then(dm => {dm.send({embed: vermsg})
					.catch(error => {
						if(error.code == "50007"){ //failed to DM
							client.users.fetch(discid).then(dem => {
								if(chanid != false){
									let faildm = {
										title: "Mekhane Verification",
										description: `You are verified, but you could not be DMed.`,
										color: embedcolor,
										footer: {
											text: `powered by ${powered}`
										}
									}
									client.guilds.cache.get(silserv).channels.cache.get(chanid).send({embed: faildm})
								}
								console.error(`failed to send verification DM to ${dem.username}#${dem.discriminator}`)
							})
						}
					})
					});
				} else {
					if(chanid != false){
						let failmsg = {
							title: "Mekhane Verification",
							description: `You are not verified, try again. For instructions, check <#VER-INST-ID>.`, //put the verify instructions channel here
							color: embedcolor,
							footer: {
								text: `powered by ${powered}`
							}
						};
						client.guilds.cache.get(silserv).channels.cache.get(chanid).send({embed: failmsg});
					}
				}
			}
	})
};

process.on('unhandledRejection', error => {
	console.error(`nonfatal error code ${error.code}`)
	console.error('Unhandled promise rejection:', error); //for debugging, remove if needed
});

client.on("guildBanRemove", function(gld, usr) {
	if(banfind(usr.id) == true){
		client.guilds.cache.get(silserv).members.ban(usr.id, "Scriptbanned, do not unban.") //done to counter corruption
	}
})

client.on("ready", () => {
  console.log(`Bot has started, server size is ${client.users.size} at the time of launch`); 
  client.user.setActivity(fmsg);
});

client.on('guildMemberAdd', async member => {
	if(member.user.bot) return;
		client.users.fetch(owner).then(async own => {
			let kickembed = {
				title: "Mekhane Alt protection",
				description: `You have been kicked from the server because your account age is less than 1 week old, this is to protect against alternate accounts. If you need urgent contact (such as a report), message \`${own.username}#${own.discriminator}\` and explain your situation.`,
				color: embedcolor,
				footer: {
					text: `powered by ${powered}`
				},
				thumbnail: {
					url: "https://cdn.discordapp.com/attachments/681321171135758440/681321402326057041/scp_logo.png" //you can change the image or remove it altogether
				},
				fields: [
					{
						name: "How do I contact?",
						value: `Click the discord icon on the top left, go to your friends tab, click \"add friend\" and enter ${own.username}#${own.discriminator} in the field. After the friend request is sent, you will be contacted.`
					}
				]
			};
			let welcome = {
				title: "Welcome to the server!",
				description: "Welcome to the community! Make sure to verify and read the rules. Have fun!", //you can change this
				color: embedcolor,
				footer: {
					text: `powered by ${powered}`
				},
				thumbnail: {
					url: "https://cdn.discordapp.com/attachments/681321171135758440/681321402326057041/scp_logo.png" //you can change this
				}
			};
			let ts = member.user.createdTimestamp;	
			let rn = Math.floor(Date.now());
			if(rn - ts <= 604800000) {
				console.log(`kicked: ${member.user.username}#${member.user.discriminator}`);
				await member.send({embed: kickembed}).catch(err => {
					if(err.code == "50007") {
						console.error(`failed to dm kick to ${member.user.username}#${member.user.discriminator}`) //logging, not an error
					}
				})
				await member.kick("Below age limit");
			} else {
				console.log(`joined: ${member.user.username}#${member.user.discriminator}`);
				member.send({embed: welcome}).catch(err => {
					if(err.code == "50007"){
						console.error(`failed to dm welcome message to ${member.user.username}#${member.user.discriminator}`) //logging, not an error
					}
				});
				verify(member.id, false);
				if(specialname(member.user.username) == true){
					member.setNickname(nicknames[Math.floor(Math.random() * nicknames.length)]) //used to check for special names, remove or comment to disable
				}
			}
		})
	
});

client.on("message", async message => {
	var authname;
	if(message.member.nickname){
		authname = message.member.nickname
	} else {
		authname = message.author.username
	}
	if(specialname(authname) == true){
	message.member.setNickname(nicknames[Math.floor(Math.random() * nicknames.length)]) 
	} //removes special nick on message, remove or comment from here up to "var authname" to disable
  	if(message.author.bot) return; //do not process bot messages
  	if(message.content.indexOf(config.prefixes.mekhane) !== 0) return;
  	const args = message.content.slice(config.prefixes.mekhane.length).trim().split(/ +/g); //command handler
 	const command = args.shift().toLowerCase();
	switch(command){
		case "help":
			let helpembed = {
				title: "Mekhane Command list",
				description: `Key: \`<field>\` is always needed, \`[field]\` is optional\nPrefix: \`${config.prefixes.mekhane}\``,
				color: embedcolor,
				footer: {
				  text: `powered by ${powered}`
				},
				fields: [
				  {
				  	name: "ping",
				  	value: "Get latency in milliseconds."
				  },
				  {
				  	name: "random",
				  	value: "Generate a random number between 1 and 10."
				  },
				  {
				  	name: "hellagay <target>",
				  	value: "Call someone hella gay." 
				  },
				  {
				  	name: "gamertags <amount>",
				  	value: "Generate xbox gamertags (Max amount is 10)."
				  },
				  {
				  	name: "verify",
				  	value: "Verifies if your ROBLOX and Discord accounts are linked, will not work if you didn't verify."
				  },
				  {
					name: "avatar [mention | id]",
					value: "Gets your avatar, or someone else's."
				  }
				]
			};
			let faildm = {
			  title: "Mekhane command list",
			  description: `Could not send commands into DMs. Perhaps enable them?`,
			  color: embedcolor,
			  footer: {
				  text: `powered by ${powered}`
			  }
		  }
		  client.users.cache.get(message.author.id).createDM().then(dm => {dm.send({embed: helpembed})
		  .catch(err => { //if unable to dm
				  if(err.code = "50007"){
					  message.channel.send({embed: faildm})
					  client.users.fetch(message.author.id).then(tgt => {
						  console.error(`Failed to send commands to ${tgt.username}#${tgt.discriminator}`)
					  })
				  }
			  })
		  })
		break;
		case "ping":
			message.channel.send(`Latency: \`${Math.floor(client.ws.ping)}ms\``);
		break;
		case "random":
			message.channel.send("Number generated: " + Math.floor((Math.random() * 10) + 1));
		break;
		case "hellagay": //i forgot i made this and it's too funny to remove
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
		break;
		case "say":
			if(message.author.id == owner) {
				let chan = args[0]
				message.delete().catch(err=>{})
				if(isNaN(chan)){
					message.channel.send(args.join(" "))
				} else {
					let msg = args.slice(1).join(" ")
					let tgt = client.guilds.cache.get(message.guild.id).channels.cache.get(chan)
					if(tgt){
						tgt.send(msg)
					} else {
						message.channel.send(args.join(" "))
					}
				}
			}
		break;
		case "gamertags":
			function names() {
				//names
				 let pref = ["Big", "Cool", "Good", "Pro", "Xx_", "Gamer", "Unturned", "Roblox", "Minecraft", "Lucky", "i"];
				let name = ["Gaming", "Games", "Boy", "Kid", "Killer"];
				let suff = ["YT", "_xX", "_", "Hacker"];
				//number generation
				let numrand = (Math.floor(Math.random() * 1000));
				let prefrand = (Math.floor(Math.random() * pref.length));
				let namerand = (Math.floor(Math.random() * name.length));
				let suffrand = (Math.floor(Math.random() * suff.length));
				let full = (pref[prefrand] + name[namerand] + numrand.toString() + suff[suffrand]);
				return full;
			}
			let rep = args[0];
			if(rep > 10) {
				message.channel.send("Number too high.");
			} else if(rep < 1) {
				message.channel.send("Number too low.")
			} else if(isNaN(rep) == true) {
				message.channel.send("Numbers only.")
			} else {
				let gtags = "";
				for(i = 1; i <= rep; i++) {
					gtags += `${names()}\n`
				}
				message.channel.send(`\`${gtags}\``);
			}
		break;
		case "playmsg":
			let msg = args.join(" ");
			if(message.author.id == owner) {
				if(msg) {
					client.user.setActivity(help + msg);
				message.channel.send("\`PLAY MESSAGE UPDATED\`");
				message.delete();
				} else {
					message.channel.send("\`MESSAGE CANNOT BE EMPTY\`")
					message.delete()
				}
			}
		break;
		case "verify":
			verify(message.author.id, message.channel.id)
		break;
		case "whois": //this is literally the most unoptimized part of the whole script
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
			let rbxid = tryParseJSON(body);
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
							color: embedcolor,
							author: {
								name: `${ftchtgt.username}#${ftchtgt.discriminator}`,
								icon_url: ftchtgt.avatarURL
							},
							footer: {
								text: `powered by ${powered}`
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
        			color: embedcolor,
       				footer: {
            			text: `powered by ${powered}`
					}
				}
				message.channel.send({embed: embed404});
			}
		});
		break;
		case "avatar":
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
				color: embedcolor,
				footer: {
					text: `powered by ${powered}`
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
            			text: `powered by ${powered}`
					}
				}
				message.channel.send({embed: embed404});
			}
		});
		break;
		case "pwrmsg":
			let pwr = args.join(" ");
			if(message.author.id == owner) {
				if(pwr) {
					powered = pwr;
					message.channel.send("\`EMBED FOOTER MESSAGE UPDATED\`");
					message.delete();
				} else {
					message.channel.send("\`MESSAGE CANNOT BE EMPTY\`")
					message.delete();
				}
			}
		break;
		case "gamenight":
			let auth = message.member.roles.cache;
			if(!(auth.has("AUTH-ID-1") || auth.has("AUTH-ID-2"))) return; // does the caller have authorization? you can add your own role IDs
			let gnm = args.join(" ")
			let gncache = client.guilds.cache.get(silserv).channels.cache // the channels
			let gnchat = gncache.get("GN-CHAT-ID") // gamenight chat
			let gncn = gncache.get("GN-ANN-ID") // gamenight announcement chat
			if(!gnm){
				message.channel.send("Please include your gamenight message.")
			} else if (args.join(" ") == "end") {
				message.delete()
				latest.delete()
				message.channel.send("Gamenight concluded.")
				gnchat.overwritePermissions([{id:vid, deny:["SEND_MESSAGES"]}])
			} else {
				message.delete();
				gncn.send(`<@&${gnid}> ${gnm}`).then(msg => latest = msg)
				gnchat.overwritePermissions([{id:vid, allow:["SEND_MESSAGES"]}])
				message.channel.send("Gamenight sent!")
			}
		break;
	}	
});

client.login(config.tokens.mekhane); //log into discord
