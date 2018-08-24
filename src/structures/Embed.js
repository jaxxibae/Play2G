const { RichEmbed } = require('discord.js')

module.exports = class Embed extends RichEmbed {
  constructor (user, data = {}) {
    super(data)
    this.setColor(this.config.embed_color).setTimestamp()
    if (user) this.setFooter(user.tag)
  }
}
