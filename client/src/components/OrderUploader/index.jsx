import React from 'react'
import ImportFromFileBodyComponent from './ImportFromFileBodyComponent'
import axios from 'axios'

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
    <div>
      <ImportFromFileBodyComponent
        onNewOrdersLoad={({ orders }) => onNewOrders(orders)}
      />
      <button onClick={() => prepareNewOrders()} className='prepare-orders-btn'>
        Prepare Orders
      </button>
    </div>
  )
}

export default OrderUploader
