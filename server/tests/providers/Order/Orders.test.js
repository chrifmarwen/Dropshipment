const assert = require('assert')
const _ = require('lodash')

const config = require('config')
const { PARCEL_STATUS } = require('../../../constants')
const Order = require('../../../models/Order')
const Orders = require('../../../providers/Order')
const ordersToBeProcess = require('./orders')

// Mock track number API
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
let mock = new MockAdapter(axios)
mock.onGet(config.get('UrlTrackGenerator')).reply(200, 'MOCKED-TRACKING-ID')

describe('Test Order processing', async () => {
  let orders = new Orders()
  let parcels = null
  before(async () => {
    parcels = await orders.processOrders(ordersToBeProcess)
  })

  it('Each parcel should have a weight <= 30', () => {
    let parcelsThatExceed30Kg = parcels.filter((parcel) => parcel.calculateWeight() > 30)
    assert.strictEqual(parcelsThatExceed30Kg.length, 0)
  })

  it('Should not have an empty parcel', () => {
    let emptyParcels = parcels.filter((parcel) => parcel.calculateWeight() === 0)
    assert.strictEqual(emptyParcels.length, 0)
  })

  it('The weight of all orders must be equal to the weight of all parcels', () => {
    let orderInstances = ordersToBeProcess.orders.map((order) => new Order(order))
    let totalOrdersWeight = _.round(orderInstances.reduce((acc, order) => acc + order.weight(), 0), 2)
    let totalParcelsWeight = _.round(parcels.reduce((acc, order) => acc + order.calculateWeight(), 0), 2)
    assert.strictEqual(totalOrdersWeight, totalParcelsWeight)
  })

  it('The sum of values of the orders should be correct', () => {
    let totalParcelValue = _.round(parcels.reduce((acc, order) => acc + order.calculateValue(), 0), 2)
    assert.strictEqual(totalParcelValue, 321)
  })

  it('All parcels should have a track number.', () => {
    let emptyTrackingIdParcels = parcels.filter((parcel) => !parcel.tracking_id)
    assert.strictEqual(emptyTrackingIdParcels.length, 0)
  })
  it('All parcels should have status of to be delivered.', () => {
    let pendingParcels = parcels.filter((parcel) => parcel.status === PARCEL_STATUS.PENDING)
    assert.strictEqual(pendingParcels.length, 0)
  })

  it('All parcels should have a palette number.', () => {
    let emptyPaletteNumberParcels = parcels.filter((parcel) => !parcel.palette_number)
    assert.strictEqual(emptyPaletteNumberParcels.length, 0)
  })

  it('Each palette number should not be used in more thant 15 parcel.', () => {
    let paletteNumberOccurrence = parcels.reduce((acc, parcel) => {
      acc[parcel.palette_number] = acc[parcel.palette_number] ? acc[parcel.palette_number] + 1 : 1
      return acc
    }, [])
    paletteNumberOccurrence.forEach((occurrence) => assert(occurrence <= 15))
  })
})
