/*
	|Mekhane|
	Made by userisinvalid

	Licensed under the MIT license

	The source code for this bot is unoptimized and sometimes unstable. Use and modify at your own risk. 
	Some IDs need to be changed for the bot to work, please check very carefully before starting.
*/

const Discord = require("discord.js");
const request = require("request");
const config = require("./config.json");
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);

var powered = "stale memes"

const embedcolor = 13376265;
const client = new Discord.Client();
client.commands = new Map();
client.config = config
client.embedcolor = embedcolor
client.powered = powered

const data = require("./data.json");

const nicknames = ["bonk", "bruh", "NO SPECIAL CHARACTERS", "edgelord", "meme thief", "cringe deluxe", "gen rule 7", "stupid", "standard name", "nickname", "generic preset"]; //add your own if you want

var latest; //stores the latest gamenight message

const help = `${config.prefix}help | `;
client.help = help

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

client.tryParseJSON = tryParseJSON

function specialname(nick){ //checks if a name is nonstandard
	if(!nick){
		return false
	}
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
					client.guilds.cache.get(config.server_id).members.cache.get(discid).roles.add(config.verified_role)
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
									client.guilds.cache.get(config.server_id).channels.cache.get(chanid).send({embed: faildm})
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
						client.guilds.cache.get(config.server_id).channels.cache.get(chanid).send({embed: failmsg});
					}
				}
			}
	})
};

client.verify = verify

process.on('unhandledRejection', error => {
	console.error(`nonfatal error code ${error.code}`)
	console.error('Unhandled promise rejection:', error); //for debugging, remove if needed
});

client.on("guildBanRemove", function(gld, usr) {
	if(banfind(usr.id) == true){
		client.guilds.cache.get(config.server_id).members.ban(usr.id, "Scriptbanned, do not unban.") //done to counter corruption
	}
})

client.on("ready", () => {
	readdir('./commands/', (error, files) => {
		if (error) throw error;
		files.forEach(file => {
		  if (!file.endsWith('.js')) return; // make sure the file is what you are looking for
		  try {
				const properties = require(`./commands/${file}`);
				client.commands.set(properties.help.name, properties);
		  	} catch (err) {
				throw err;
		  }  
		});
	});

	console.log(`Bot has started, server size is ${client.users.size} at the time of launch`); 
	client.user.setActivity(fmsg);
})

client.on('guildMemberAdd', async member => {
	if(member.user.bot) return;
		client.users.fetch(config.owner).then(async own => {
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
	if(message.member){
		var authname = message.member.nickname ? message.author.username : null;
		if(specialname(authname) == true){
			message.member.setNickname(nicknames[Math.floor(Math.random() * nicknames.length)]) //remove or comment to disable nickname enforcing
		}
	}
  	if(message.author.bot) return; //do not process bot messages
  	if(message.content.indexOf(config.prefix) !== 0) return;
  	const args = message.content.slice(config.prefix.length).trim().split(/ +/g); //command handler
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command);

	if (!cmd) return; // the message is not a command we know of
	cmd.run(client, message, args); // run the command with client object, message object and args array
});

client.login(client.config.token); //log into discord
