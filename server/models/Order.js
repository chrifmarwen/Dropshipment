const { v4 } = require('uuid')
const _ = require('lodash')
const store = require('../items')
const Item = require('./Item')
const OrderLine = require('./OrderLine')

class Order {
  constructor({ id, date, items }) {
    // Prepare store
    let storedItems = store.items.map((elem) => new Item(elem))

    this.id = id ? id : v4()
    this.date = date
    this.orderLines = items.map((item) => {
      let [itemModel,] = storedItems.filter((elem) => elem.id === item.item_id)
      if (!itemModel)
        throw new Error(`Item with id ${item.item_id} is not found.`)
      return new OrderLine({ item: itemModel, quantity: item.quantity })
    })
    this.weight = this.weight.bind(this)
  }

  weight() {
    return _.round(this.orderLines.reduce((acc, orderLine) => acc + orderLine.weight(), 0), 2)
  }
}

module.exports = Order
