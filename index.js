const clientOptions = {
  fetchAllMembers: true,
  enableEveryone: false
}

require('moment')
require('moment-duration-format')

const { Hinako } = require('./src/')
const client = new Hinako(clientOptions)

client.login().then(() => client.log('Connected successfully!', 'Discord')).catch(e => client.logError(e))
