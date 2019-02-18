import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import ImportFromFileBodyComponent from './ImportFromFileBodyComponent'

const OrderUploader = ({ newOrders, onNewOrders, onNewParcels, onLoading }) => {

  const prepareNewOrders = () => {
    onLoading(true)
    axios.post('/api/orders', {
      orders: newOrders
    })
      .then(function ({ data }) {
        onNewParcels(data)
      })
      .catch(function (error) {
        console.error(error)
        onNewParcels([])
      })
  }

  return (
    <div className='order-uploader'>
      <ImportFromFileBodyComponent
        onNewOrdersLoad={({ orders }) => onNewOrders(orders)}
      />
      <button onClick={() => prepareNewOrders()} className='prepare-orders-btn'>
        Prepare Orders
      </button>
    </div>
  )
}

OrderUploader.propTypes = {
  newOrders: PropTypes.array.isRequired,
  onNewOrders: PropTypes.func.isRequired,
  onNewParcels: PropTypes.func.isRequired,
  onLoading: PropTypes.func.isRequired
}

export default OrderUploader
