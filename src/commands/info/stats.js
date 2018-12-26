const { Command, Embed } = require('../../structures')
const moment = require('moment')
const MEGABYTE = 1024 * 1024

module.exports = class Stats extends Command {
  constructor (client) {
    super(client)
    this.name = 'stats'
    this.aliases = ['botstats']
    this.category = 'info'
  }

  run (message, args, strings) {
    const embed = new Embed(message.author)
    const memory = process.memoryUsage()
    embed.setTitle(strings.statistics.replace('{0}', this.client.user.username))
      .setThumbnail(this.client.user.displayAvatarURL)
      .addField(strings.uptime, moment.duration(process.uptime() * 1000).format(strings.format), true)
      .addField(strings.ping, `${Math.floor(this.client.ping)}ms`, true)
      .addField(strings.commands, this.client.commands.length, true)
      .addField(strings.ram, strings.totalRam.replace('{0}', Math.floor(memory.heapUsed / MEGABYTE)).replace('{1}', Math.floor(memory.heapTotal / MEGABYTE)), true)
    message.channel.send(embed)
  }
}
