module.exports.run = async (client, message, args) => {
    let helpembed = {
        title: "Mekhane Command list",
        description: `Key: \`<field>\` is always needed, \`[field]\` is optional\nPrefix: \`${client.config.prefix}\``,
        color: client.embedcolor,
        footer: {
          text: `powered by ${client.powered}`
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
      color: client.embedcolor,
      footer: {
          text: `powered by ${client.powered}`
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
};

module.exports.help = {
    name: 'help'
};