const EventEmitter = require('events')

class ServiceProvider extends EventEmitter {

  constructor() {
    super()
  }

  static validate(method) {
    throw new Error('Validate function is not implemented for this route.')
  }
}

module.exports = ServiceProvider
