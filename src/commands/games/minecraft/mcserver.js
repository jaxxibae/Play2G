const { Command, Embed } = require('../../../structures')
const { Constants } = require('../../../utils')
const rp = require('request-promise-native')

module.exports = class MCServer extends Command {
  constructor (client) {
    super(client)
    this.name = 'mcserver'
    this.category = 'games'
  }

  async run (message, args) {
    const command = this
    const embed = new Embed(message.author)
    message.channel.startTyping()
    if (!args[0] || args[1]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle('Endereço de IP inválido')
    } else {
      const address = args[0].split(':')
      const ip = address[0]
      const port = address[1] || 25565
      await rp({uri: `https://mcapi.xdefcon.com/server/${ip}/full/json?port=${port}`, json: true}).then(async response => {
        if (response.serverStatus === 'online') {
          const icon = response.icon ? await command.uploadBase64(response.icon.replace('data:image/png;base64,', '')) : null
          embed.setAuthor(address.join(':'), icon)
            .addField('🖥 Estado do Servidor', 'Online', true)
            .addField('🎛 Versão', response.version, true)
            .addField('👥 Jogadores', `${response.players} de ${response.maxplayers}`, true)
            .addField('📝 Mensagem do Dia (MOTD)', response.motd.text !== ' ' ? response.motd.text : 'Este servidor não possui MOTD', true)
            .setColor(Constants.ONLINE_COLOR)
            .setThumbnail(icon)
        } else {
          embed.addField('🖥 Estado do Servidor', 'Offline', true)
            .setColor(Constants.ERROR_COLOR)
        }
      }).catch(e => {
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(`Um erro ocorreu: ${e}`)
      })
    }
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }

  async uploadBase64 (image) {
    await this.client.apis.imgur.uploadBase64(image).then(img => {
      return img.data.link
    })
  }
}
