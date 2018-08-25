const { APIWrapper } = require('../structures')
const Imgur = require('imgur')

module.exports = class ImgurAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'imgur'
    this.envVars = ['IMGUR_CLIENT_ID', 'IMGUR_API_URL']
  }

  load () {
    Imgur.setClientId(process.env.IMGUR_CLIENT_ID)
    return Imgur
  }
}
