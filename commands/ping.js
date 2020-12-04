module.exports.run = async (client, message, args) => {
    message.channel.send(`Latency: \`${Math.floor(client.ws.ping)}ms\``);
};
    
module.exports.help = {
    name: 'ping'
};