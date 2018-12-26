const { Command } = require('../../structures/')

const exec = require('child_process').exec;

module.exports = class Bash extends Command {
  constructor (client) {
    super(client)
    this.name = 'bash'
    this.hidden = true
    this.developerOnly = true
  }

  run (message, args) {
    exec(args.join(' '), (error, stdout, stderr) => {
      if (error) return message.reply(`:negative_squared_cross_mark: | ${error}`);
      else return message.channel.send(`\`\`\`${stdout ? stdout : 'null'}\`\`\``);
    })
  }
}
