module.exports.run = async (client, message, args) => {
    message.channel.send("Number generated: " + Math.floor((Math.random() * 10) + 1));
};
    
module.exports.help = {
    name: 'random'
};