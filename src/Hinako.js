const { Client } = require('discord.js')
const { Command, EventListener, APIWrapper } = require('./structures')
const { MongoDB } = require('./database')
const { FileUtils } = require('./utils')

const fs = require('fs')
const colors = require('colors')

module.exports = class Hinako extends Client {
  constructor (options = {}) {
    super(options)

    this.apis = []
    this.commands = []
    this.listeners = []
    this.strings = []

    this.initializeDatabase(MongoDB, { useNewUrlParser: true })
    this.initializeApis('src/apis')
    this.initializeStrings('src/strings')
    this.initializeListeners('src/listeners')
    this.initializeCommands('src/commands')
  }

  login (token) {
    token = token || process.env.DISCORD_TOKEN
    return super.login(token)
  }

  log (...args) {
    const message = args[0]
    const tags = args.slice(1).map(t => `[${t}]`)
    console.log(colors.green(...tags), colors.green(message))
  }

  logError (...args) {
    const tags = args.length > 1 ? args.slice(0, -1).map(t => `[${t}]`) : []
    console.error(colors.red('[ErrorLog]'), colors.red(...tags), colors.red(args[args.length - 1]))
  }

  // Commands

  addCommand (command) {
    if (command instanceof Command && command.canLoad()) {
      this.commands.push(command)
    }
  }

  initializeCommands (dirPath) {
    return FileUtils.requireDirectory(dirPath, (NewCommand) => {
      if (Object.getPrototypeOf(NewCommand) !== Command || NewCommand.ignore) return
      this.addCommand(new NewCommand(this))
      this.log(`${NewCommand.name} loaded.`, 'Commands')
    }, this.logError)
  }

  // Listeners

  addListener (listener) {
    if (listener instanceof EventListener) {
      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

      listener.events.forEach(event => {
        this.on(event, listener['on' + capitalize(event)])
      })

      this.listeners.push(listener)
    }
  }

  initializeListeners (dirPath) {
    return FileUtils.requireDirectory(dirPath, (NewListener) => {
      if (Object.getPrototypeOf(NewListener) !== EventListener) return
      this.addListener(new NewListener(this))
      this.log(`${NewListener.name} loaded.`, 'Listeners')
    }, this.logError)
  }

  // APIs

  addApi (api) {
    if (api instanceof APIWrapper && api.canLoad()) {
      this.apis[api.name] = api.load()
    }
  }

  initializeApis (dirPath) {
    return FileUtils.requireDirectory(dirPath, (NewAPI) => {
      if (Object.getPrototypeOf(NewAPI) !== APIWrapper) return
      this.addApi(new NewAPI())
      this.log(`${NewAPI.name} loaded.`, 'APIs')
    }, this.logError)
  }

  // Strings

  initializeStrings (dirPath) {
    fs.readdirSync(dirPath).forEach(file => {
      if (file.endsWith('.json')) {
        try {
          this.strings[file.replace('.json', '')] = Object.assign(require(`./strings/${file}`))
          this.log('Strings loaded successfully!', 'Strings')
        } catch (e) {
          this.logError(`Strings weren't loaded successfully. Exiting...\n${e}`)
          process.exit(0)
        }
      }
    })
  }

  // Database

  initializeDatabase (DBWrapper, options = {}) {
    this.database = new DBWrapper(options)
    this.database.connect()
      .then(() => this.log('Database connection established!', 'DB'))
      .catch(e => {
        this.logError(e.message, 'DB')
        this.database = null
      })
  }
}
