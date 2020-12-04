module.exports.run = async (client, message, args) => {
    if(client.config.whitelist.includes(message.author.id)) {
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
};
    
module.exports.help = {
    name: 'say'
};