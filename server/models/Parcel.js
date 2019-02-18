const { PARCEL_STATUS } = require('../constants')
const _ = require('lodash')

class Parcel {
  constructor({ id, orderLines, status = PARCEL_STATUS.PENDING, tracking_id, palette_number }) {
    this.order_id = id
    this.orderLines = orderLines
    this.status = status
    this.tracking_id = tracking_id
    this.palette_number = palette_number

    this.calculateValue = this.calculateValue.bind(this)
    this.toJSON = this.toJSON.bind(this)
  }

  calculateWeight() {
    return _.round(this.orderLines.reduce((acc, orderLine) => acc + orderLine.weight(), 0), 2)
  }

  calculateValue() {
    let parcelWeight = this.calculateWeight()
    let total = 0
    if (parcelWeight <= 1.0) {
      total = 1.0
    } else if (parcelWeight <= 5.0) {
      total = 2.0
    } else if (parcelWeight <= 10.0) {
      total = 3.0
    } else if (parcelWeight <= 20.0) {
      total = 5.0
    } else {
      total = 10.0
    }
    return _.round(total, 2)
  }

  addOrderLine(orderLine) {
    let nextWeight = this.calculateWeight() + orderLine.weight()
    if (nextWeight <= 30) {
      this.orderLines = [...this.orderLines, orderLine]
    }
    return nextWeight <= 30
  }

  toJSON() {
    let { order_id, orderLines, status, tracking_id, palette_number } = this
    return {
      order_id,
      items: orderLines,
      status,
      tracking_id,
      palette_number,
      weight: this.calculateWeight(),
      value: this.calculateValue()
    }
  }
}

module.exports = Parcel
