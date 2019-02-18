const _ = require('lodash')

class OrderLine {
  constructor({ item, quantity }) {
    this.item = item
    this.quantity = quantity
    this.weight = this.weight.bind(this)
    this.toJSON = this.toJSON.bind(this)
  }

  weight() {
    return _.round(this.quantity * this.item.weight, 2)
  }

  toJSON() {
    let { item, quantity } = this
    return { item, quantity }
  }
}

module.exports = OrderLine
