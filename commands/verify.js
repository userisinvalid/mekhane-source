module.exports.run = async (client, message, args) => {
    client.verify(message.author.id, message.channel.id)
};
    
module.exports.help = {
    name: 'verify'
};