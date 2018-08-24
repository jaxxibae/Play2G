const { EventListener } = require('../structures')

module.exports = class ReadyListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready']
  }

  onReady () {
    const client = this
    const watchingMessages = [
      `${this.guilds.size} servers`,
      `${this.channels.size} channels`,
      `${this.users.size} users`,
      `you`
    ]
    setInterval(function () {
      const randomWatchingMessage = watchingMessages[Math.floor(Math.random() * watchingMessages.length)]
      client.user.setPresence({ game: { name: randomWatchingMessage, type: 'WATCHING' } })
      client.log(`Changed presence to "Watching ${randomWatchingMessage}"`, 'Presence')
    }, 60 * 1000)
  }
}
