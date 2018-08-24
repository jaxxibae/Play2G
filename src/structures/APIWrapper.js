module.exports = class APIWrapper {
  constructor () {
    this.name = ''
    this.envVars = []
  }

  /**
   * Check if the API can load
   * @returns {boolean} - Whether the API can load
   */
  canLoad () {
    return this.envVars.length ? this.envVars.every(v => this.config[v]) : true
  }

  /**
   * Loads the API
   * @returns {Object} - The loaded API
   */
  load () {
    return this
  }
}
