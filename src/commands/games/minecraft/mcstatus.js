const { Command } = require('../../../structures')
const rp = require('request-promise-native')

module.exports = class MCStatus extends Command {
  constructor (client) {
    super(client)
    this.name = 'mcstatus'
  }

  async run (message) {
    message.channel.startTyping()
    const servers = require('../../../resources/Minecraft/servers.json')

    let status = await Promise.all(servers.map(async ({url, name}) => {
      var response = await rp.head({ url, simple: false, resolveWithFullResponse: true, timeout: 5000, time: true }).catch(e => e)
      var online = (response.statusCode === 200 || response.statusCode === 404 || response.statusCode === 403) ? response.elapsedTime : false
      return {url, name, online}
    }))

    const map = status.map(s => s.online ? `+ ${s.name}: Online (${s.online}ms)` : `- ${s.name}: Offline`)

    message.channel.send(`\`\`\`diff\nMinecraft Status\n\n${map.join('\n')}\`\`\``).then(() => message.channel.stopTyping())
  }
}
