const { compose } = require('ramda')
const { body } = require('express-validator/check')

const ServiceProvider = require('../ServiceProvider')
const OrderProcessor = require('./OrderProcessor')

class Orders extends ServiceProvider {

  constructor() {
    super()
    this.processOrders = this.processOrders.bind(this)
    this.on('process_orders', this.processOrders)
  }

  static validate(method) {
    switch (method) {
      case 'process_orders': {
        return [
          body('orders', 'orders need to be an array').not().isEmpty()
        ]
      }
      default:
        throw new Error(`This method ${method} is not supported by Orders provider.`)
    }
  }

  /**
   *
   * @param orders
   * @returns {Promise<void>}
   */
  async processOrders({ orders }) {
    let parcels = await compose(
      OrderProcessor.setParcelTracking,
      OrderProcessor.setPaletteNumber,
      OrderProcessor.prepareParcels,
      OrderProcessor.prepareForPackaging,
      OrderProcessor.prepareOrders
    )(orders)
    this.emit('process_orders' + '_DONE', null, { data: parcels })
    return parcels
  }
}

module.exports = Orders
