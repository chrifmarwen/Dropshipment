import React from 'react'
import ReactDataGrid from 'react-data-grid'
import { v4 } from 'uuid'
import PropTypes from 'prop-types'

const columns = [
  { key: 'order_id', name: 'Order ID' },
  {
    key: 'items',
    name: 'Items',
    formatter: ({ value }) => <ul>
      {
        value.map((item) => <li key={v4()}>{item.quantity} x {item.item.name}</li>
        )
      }
    </ul>
  },
  { key: 'weight', name: 'Weight' },
  { key: 'status', name: 'Status' },
  { key: 'tracking_id', name: 'Tracking ID' },
  { key: 'palette_number', name: 'Palette number' },
  { key: 'value', name: 'Value (€)' }
]

const ParcelsVisualiser = ({ parcels }) => {

  return (
    <div>
      <ReactDataGrid
        columns={columns}
        rowGetter={i => parcels[i]}
        rowsCount={parcels.length}
        minHeight={750} />
    </div>
  )
}

ParcelsVisualiser.propTypes = {
  parcels: PropTypes.array.isRequired
}

ParcelsVisualiser.defaultProps = {
  parcels: []
}

export default ParcelsVisualiser
