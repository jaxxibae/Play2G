const clientOptions = {
  fetchAllMembers: true,
  enableEveryone: false
}

require('moment')
require('moment-duration-format')

const { Play2G } = require('./src/')
const client = new Play2G(clientOptions)

client.login().then(() => client.log('Logged in successfully!', 'Discord')).catch(e => client.logError)
