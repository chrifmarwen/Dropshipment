import React, { Component } from 'react'
import './App.scss'
import OrderUploader from './components/OrderUploader'
import ParcelsVisualiser from './components/ParcelsVisualiser'
import Loader from './components/Loader'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newOrders: [],
      newParcels: [],
      loading: false
    }
  }

  /**
   * New orders listener
   * @param newOrders
   */
  onNewOrders(newOrders) {
    this.setState({
      ...this.state,
      newOrders,
      loading: false
    })
  }

  /**
   * New Parcels listener
   * @param data
   */
  onNewParcels({ data }) {
    this.setState({
      ...this.state,
      newParcels: data,
      loading: false
    })
  }

  /**
   * Set loading in state
   * @param loading
   */
  onLoading(loading) {
    this.setState({
      ...this.state,
      loading
    })
  }

  render() {
    let { newOrders, newParcels, loading } = this.state
    let totalValue = newParcels.reduce((acc, parcel) => acc + parcel.value, 0)
    return (
      <div className="App">
        <header className="App-header">
          Wing Test
        </header>
        <div className="container">
          <Loader
            loading={loading}
          />
          <OrderUploader
            newOrders={newOrders}
            onLoading={this.onLoading.bind(this)}
            onNewOrders={this.onNewOrders.bind(this)}
            onNewParcels={this.onNewParcels.bind(this)}
          />
          <div className='total-amount'>
            <label>Total Value:</label>
            <span>{totalValue} €</span>
          </div>
          <ParcelsVisualiser parcels={newParcels} />
        </div>
      </div>
    )
  }
}

export default App
