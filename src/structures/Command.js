module.exports = class Command {
  constructor (client, parentCommand) {
    this.client = client

    this.name = 'command'
    this.aliases = []

    this.hidden = false
    this.developerOnly = false

    this.subcommands = []

    this.parentCommand = parentCommand
  }

  canRun () {
    return true
  }

  canLoad () {
    return true
  }

  _run (msg, args, strings, user) {
    if (this.developerOnly && process.env.OWNER_ID && user.id !== process.env.OWNER_ID) return msg.channel.send(`:no_good:, ${user} | Apenas o meu criador pode usar esse comando!`)
    if (args.length > 0) {
      let subcommand = this.subcommands.find(c => c.name.toLowerCase() === args[0] || c.aliases.includes(args[0]))
      if (subcommand && subcommand.canRun(msg, args.slice(1))) {
        return subcommand.run(msg, args.slice(1), strings, user)
      }
    }
    return this.run(msg, args, strings, user)
  }

  run () {}
}
