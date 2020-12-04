module.exports.run = async (client, message, args) => {
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
};
    
module.exports.help = {
    name: 'gamertags'
};