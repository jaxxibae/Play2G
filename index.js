const clientOptions = {
  fetchAllMembers: true,
  enableEveryone: false
}

require('moment')
require('moment-duration-format')

const { Play2G } = require('./src/')
const client = new Play2G(clientOptions)

client.login().then(() => client.log('Connected successfully!', 'Discord')).catch(e => client.logError(e))
