const { Command } = require('../../structures')

module.exports = class Settings extends Command {
  constructor (client) {
    super(client)
    this.name = 'settings'
    this.hidden = true
  }

  canLoad () {
    return !!process.env.OWNER_ID
  }

  async run (message, args) {
    // if (message.author.id !== process.env.OWNER_ID) return
    switch (args[0]) {
      case 'status': {
        this.client.user.setPresence({ game: { name: args.slice(2).join(' '), type: args[1] } }).then(() => message.channel.send(':+1:')).catch(err => message.channel.send(':-1:\n' + err))
      }
    }
  }

  clean (text) {
    const blankSpace = String.fromCharCode(8203)
    return typeof text === 'string' ? text.replace(/`/g, '`' + blankSpace).replace(/@/g, '@' + blankSpace) : text
  }
}
