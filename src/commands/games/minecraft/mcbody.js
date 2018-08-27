const { Command, Embed } = require('../../../structures')
const { Constants } = require('../../../utils')
const API_URL = 'https://minotar.net/armor/body/'

module.exports = class MCBody extends Command {
  constructor (client) {
    super(client)
    this.name = 'mcbody'
  }

  run (message, args, strings) {
    const embed = new Embed(message.author)
    message.channel.startTyping()
    if (!args[0] || args[1]) {
      embed.setTitle(strings.invalid)
        .setColor(Constants.ERROR_COLOR)
    } else {
      embed.setTitle(strings.body.replace('{0}', args[0]))
        .setImage(API_URL + args[0])
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
