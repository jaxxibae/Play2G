const { EventListener } = require('../structures')

module.exports = class ReadyListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready']
  }

  onReady () {
    const client = this
    const watchingMessages = [
      `${this.guilds.size} servidores! ✨`,
      `${this.channels.size} canais! 👑`,
      `${this.users.size} usuários! 🍃`,
      `você! 👀`
    ]
    setInterval(function () {
      const randomWatchingMessage = watchingMessages[Math.floor(Math.random() * watchingMessages.length)]
      client.user.setPresence({ game: { name: randomWatchingMessage, type: 'WATCHING' } })
      client.log(`Presença alterada para "Assistindo ${randomWatchingMessage}"`, 'Presence')
    }, 60 * 1000)
  }
}
