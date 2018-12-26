/* eslint-disable no-eval */

const { Command } = require('../../structures')
const util = require('util')

module.exports = class Eval extends Command {
  constructor (client) {
    super(client)
    this.name = 'eval'
    this.aliases = ['execute']
    this.hidden = true
    this.developerOnly = true
  }

  canLoad () {
    return !!process.env.OWNER_ID
  }

  async run (message, args) {
    try {
      const evaled = await eval(args.join(' '))
      const cleanEvaled = this.clean(util.inspect(evaled, { depth: 1 }))
      await message.channel.send(cleanEvaled, { code: 'xl' })
    } catch (err) {
      message.channel.send('`ERROR` ```xl\n' + this.clean(err) + '\n```')
    }
  }

  clean (text) {
    const blankSpace = String.fromCharCode(8203)
    return typeof text === 'string' ? text.replace(/`/g, '`' + blankSpace).replace(/@/g, '@' + blankSpace) : text
  }
}
