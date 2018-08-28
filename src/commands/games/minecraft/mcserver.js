const { Command, Embed } = require('../../../structures')
const { Constants } = require('../../../utils')
const rp = require('request-promise-native')

module.exports = class MCServer extends Command {
  constructor (client) {
    super(client)
    this.name = 'mcserver'
  }

  async run (message, args) {
    const command = this
    const embed = new Embed(message.author)
    message.channel.startTyping()
    if (!args[0] || args[1]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle('Invalid IP address')
    } else {
      const address = args[0].split(':')
      const ip = address[0]
      const port = address[1] || 25565
      await rp({uri: `https://mcapi.xdefcon.com/server/${ip}/full/json?port=${port}`, json: true}).then(async response => {
        console.log(response)
        if (response.serverStatus === 'online') {
          const icon = response.icon ? await command.uploadBase64(response.icon.replace('data:image/png;base64,', '')) : null
          embed.setAuthor(address.join(':'), icon)
            .addField('🖥 Server Status', 'Currently online.', true)
            .addField('🖥 Version', response.version, true)
            .addField('👥 Members', `${response.players}/${response.maxplayers}`, true)
            .addField('📝 Message of the Day (MOTD)', response.motd, true)
            .setColor(Constants.ONLINE_COLOR)
            .setThumbnail(icon)
        } else {
          embed.addField('🖥 Server Status', 'Offline.', true)
            .setColor(Constants.ERROR_COLOR)
        }
      }).catch(e => {
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(`An error has occurred\n${e}`)
      })
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }

  async uploadBase64 (image) {
    return await this.client.apis.imgur.uploadBase64(image).then(img => {
      return img.data.link
    })
  }
}
