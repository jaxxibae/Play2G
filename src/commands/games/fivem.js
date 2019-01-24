const { Command, Embed } = require('../../structures')
const { Constants } = require('../../utils')

const fivem = require('fivem-api')
const rp = require('request-promise-native')

module.exports = class FiveM extends Command {
  constructor (client) {
    super(client)
    this.name = 'fivem'
    this.subcommands = [new FiveMStatus(client, this)]
    this.category = 'games'
  }

  async run (message, args, strings) {
    const embed = new Embed(message.author)
    const serverIp = args[0]
    message.channel.startTyping()
    if (!serverIp || args[1]) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(strings.invalidIp)
    } else {
      await fivem.getServerInfo(serverIp).then(async server => {
        const image = server.infos.icon ? await this.uploadBase64(server.infos.icon) : null
        embed.setTitle(server.infos.vars.sv_hostname)
          .setThumbnail(image)
          .addBlankField()
          .addField(strings.stats, [
            `${strings.address}: **${serverIp}**`,
            `${strings.players}: **${server.players.length}/${server.infos.vars.sv_maxClients}**`,
            `${strings.onesync}: **${server.infos.vars.onesync_enabled}**`,
            `${strings.scriptHook}: **${server.infos.vars.sv_scriptHookAllowed}**`
          ].join('\n'))
          .addBlankField()
          .addField(strings.players, server.players.length > 0 ? server.players.map(p => p.name).join(', ') : 'None')
      }).catch(() => {
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(strings.offline)
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

class FiveMStatus extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand)
    this.name = 'status'
  }

  async run (message) {
    message.channel.startTyping()
    const servers = require('../../resources/FiveM/servers.json')

    let status = await Promise.all(servers.map(async ({url, name}) => {
      var response = await rp.head({ url, simple: false, resolveWithFullResponse: true, timeout: 5000, time: true }).catch(e => e)
      var online = (response.statusCode === 200 || response.statusCode === 404) ? response.elapsedTime : false
      return {url, name, online}
    }))

    const map = status.map(s => s.online ? `+ ${s.name}: Online (${s.online}ms)` : `- ${s.name}: Offline`)

    message.channel.send(`\`\`\`diff\nEstado do FiveM\n\n${map.join('\n')}\`\`\``).then(() => message.channel.stopTyping())
  }
}
