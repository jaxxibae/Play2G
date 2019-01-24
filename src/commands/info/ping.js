const { Command, Embed } = require('../../structures')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client)
    this.name = 'ping'
    this.category = 'info'
  }

  run (message, args, strings) {
    message.channel.send(new Embed(message.author)
      .setDescription(':ping_pong: ...')
    ).then((newMessage) => {
      const messages = [
        strings.ping,
        strings.discordPing.replace('{0}', newMessage.createdAt - message.createdAt),
        strings.wsPing.replace('{1}', Math.floor(this.client.ping))
      ]
      newMessage.edit(new Embed(message.author)
        .setDescription(messages.join('\n'))
      )
    })
  }
}
