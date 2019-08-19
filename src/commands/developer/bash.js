const { Command } = require('../../structures/')

const exec = require('child_process').exec

module.exports = class Bash extends Command {
  constructor (client) {
    super(client)
    this.name = 'bash'
    this.hidden = true
    this.developerOnly = true
  }

  canLoad () {
    return !!process.env.OWNER_ID
  }

  run (message, args) {
    exec(args.join(' '), (error, stdout, stderr) => {
      if (error) return message.reply(`:negative_squared_cross_mark: | ${error}`)
      return message.channel.send(`\`\`\`${stdout || null}\`\`\``)
    })
  }
}
