const { Command } = require('../../structures')

module.exports = class Settings extends Command {
  constructor (client) {
    super(client)
    this.name = 'settings'
    this.hidden = true
    this.developerOnly = true
  }

  canLoad () {
    return !!process.env.OWNER_ID
  }

  async run (message, args) {
    switch (args[0]) {
      case 'presence': {
        this.client.user.setPresence({ game: { name: args.slice(2).join(' '), type: args[1] } })
          .then(() => message.reply(':white_check_mark:'))
          .catch(err => message.reply(':negative_squared_cross_mark:\n' + err))
      }
    }
  }
}
