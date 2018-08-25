const { RichEmbed } = require('discord.js')

module.exports = class Embed extends RichEmbed {
  constructor (user, data = {}) {
    super(data)
    this.setColor(process.env.EMBED_COLOR).setTimestamp()
    if (user) this.setFooter(user.tag)
  }
}
