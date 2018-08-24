const { EventListener } = require('../structures')

module.exports = class MessageListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['message']
  }

  async onMessage (message) {
    if (message.author.bot) return
    const prefix = process.env.PREFIX
    const prefixRegex = new RegExp(`^(<@[!]?${this.user.id}>[ ]?|${prefix}).+`)
    const regexResult = prefixRegex.exec(message.content)
    if (regexResult) {
      const usedPrefix = regexResult[1]
      const fullCmd = message.content.split(' ').filter(a => a).map(s => s.trim())
      const args = fullCmd.slice(1)
      const cmd = fullCmd[0].substring(usedPrefix.length).toLowerCase()
      const command = this.commands.find(c => c.name.toLowerCase() === cmd || c.aliases.includes(cmd))
      if (command && command.canRun(message, args)) {
        const commandStrings = this.strings['strings'].commands[`${command.name}`]
        const user = message.mentions.users.first() || this.users.get(args[0]) || message.author
        command._run(message, args, commandStrings, user)
        this.log(`"${message.content}" (${command.constructor.name}) executed by "${message.author.tag}" (${message.author.id}) on server "${message.guild.name}" (${message.guild.id}) channel "#${message.channel.name}" (${message.channel.id})`, 'Command')
      }
    }
  }
}
