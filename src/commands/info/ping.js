const { Command, Embed } = require('../../structures')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client)
    this.name = 'ping'
    this.category = 'info'
  }

  run (message, args, strings) {
    const embed = new Embed(message.author).setDescription(':ping_pong: ...')
    message.channel.send(embed).then((newMessage) => {
      const messages = [
        strings.ping,
        strings.discordPing.replace('{0}', newMessage.createdAt - message.createdAt),
        strings.wsPing.replace('{1}', Math.floor(this.client.ping))
      ]
      embed.setDescription(messages.join('\n'))
      newMessage.edit(embed)
    })
  }
}
