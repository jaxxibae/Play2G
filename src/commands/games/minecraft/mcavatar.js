const { Command, Embed } = require('../../../structures')
const { Constants } = require('../../../utils')
const API_URL = 'https://minotar.net/avatar/'

module.exports = class MCAvatar extends Command {
  constructor (client) {
    super(client)
    this.name = 'mcavatar'
    this.category = 'games'
  }

  run (message, args, strings) {
    const embed = new Embed(message.author)
    message.channel.startTyping()
    if (!args[0] || args[1]) {
      embed.setTitle(strings.invalid)
        .setColor(Constants.ERROR_COLOR)
        .setDescription(`\`${strings._usage ? strings._usage : null}\``)
    } else {
      embed.setTitle(strings.avatar.replace('{0}', args[0]))
        .setImage(API_URL + args[0])
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
