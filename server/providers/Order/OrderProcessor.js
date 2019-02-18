const axios = require('axios')
const config = require('config')

const { PARCEL_STATUS } = require('../../constants')
const wait = require('../../helper/wait')
const Order = require('../../models/Order')
const OrderLine = require('../../models/OrderLine')
const Parcel = require('../../models/Parcel')

class OrderProcessor {

  /**
   * This function will convert json object to Order class
   * @param orders
   * @returns {*}
   */
  static prepareOrders(orders) {
    return orders.map((order) => new Order(order))
  }

  /**
   * This function will break big order line in small pieces that could fit in parcels
   * @param orders
   * @returns {*}
   */
  static prepareForPackaging(orders) {
    return orders.map((order) => {
      if (order.weight() > 30) {
        let { orderLines } = order
        orderLines = orderLines.reduce((orderLinesAccumulator, orderLine) => {
          if (orderLine.weight() <= 30) {
            orderLinesAccumulator = [...orderLinesAccumulator, orderLine]
          } else {
            while (orderLine.weight() > 30) {
              orderLine.quantity -= 1
              orderLinesAccumulator = [...orderLinesAccumulator, new OrderLine({
                ...orderLine,
                quantity: 1
              })]
            }
            orderLinesAccumulator = [...orderLinesAccumulator, orderLine]
          }
          return orderLinesAccumulator
        }, [])
        order.orderLines = orderLines
        return order
      }
      return order
    }, [])
  }

  /**
   * This function will regroup order lines and package them in parcels
   * @param orders
   */
  static prepareParcels(orders) {
    return orders.reduce((acc, order) => {
      if (order.weight() > 30) {
        let { orderLines } = order
        let parcels = orderLines.reduce((parcelAccumulator, orderLine) => {
          let parcel = parcelAccumulator.pop()
          if (!parcel.addOrderLine(orderLine)) {
            parcelAccumulator = [...parcelAccumulator, parcel]
            parcel = new Parcel({ ...order, orderLines: [orderLine] })
          }
          return [...parcelAccumulator, parcel]
        }, [new Parcel({ ...order, orderLines: [] })])
        return [...acc, ...parcels]
      } else {
        return [...acc, new Parcel(order)]
      }
    }, [])
  }

  /**
   * This function will set the palette number
   */
  static setPaletteNumber(parcels) {
    let localParcels = [...parcels]
    let currentPaletteNumber = 1
    let paletteCounter = 0
    for (let parcel of localParcels) {
      parcel.palette_number = currentPaletteNumber
      paletteCounter++
      if (paletteCounter === 15) {
        paletteCounter = 0
        currentPaletteNumber++
      }
    }
    return localParcels
  }

  /**
   * Set the tracking id to the parcel
   */
  static async setParcelTracking(parcels) {
    return new Promise(async function (resolve, reject) {
      for (let i = 0; i < parcels.length; i++) {
        if (i > 0 && i % config.get('ParcelToTrackInParallel') === 0)
          await wait(config.get('WaitFor'))
        axios.get(config.get('UrlTrackGenerator'))
          .then(function ({ data }) {
            parcels[i].tracking_id = data
            parcels[i].status = PARCEL_STATUS.TO_DELIVER
            if (i === parcels.length - 1)
              resolve(parcels)
          })
          .catch(function (error) {
            console.error(error)
            axios.get(config.get('UrlTrackGenerator'))
              .then(function ({ data }) {
                parcels[i].tracking_id = data
                parcels[i].status = PARCEL_STATUS.TO_DELIVER
                if (i === parcels.length - 1)
                  resolve(parcels)
              })
              .catch(function (error) {
                console.error(error)
                if (i === parcels.length - 1)
                  reject(parcels)
              })
          })
      }
    })
  }

}

module.exports = OrderProcessor
