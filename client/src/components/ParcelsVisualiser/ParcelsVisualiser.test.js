import React from 'react'
import ReactDOM from 'react-dom'
import ParcelsVisualiser from './index'
import { mount } from 'enzyme'

const parcels = [
  {
    'order_id': '5bb61dfd3741808151aa413b',
    'items': [
      {
        'item': {
          'id': '5bb619e49593e5d3cbaa0b52',
          'weight': '1.5',
          'name': 'Flowers'
        },
        'quantity': 4
      },
      {
        'item': {
          'id': '5bb619e49593e5d3cbaa0b52',
          'weight': '1.5',
          'name': 'Flowers'
        },
        'quantity': 1
      },
      {
        'item': {
          'id': '5bb619e49593e5d3cbaa0b52',
          'weight': '1.5',
          'name': 'Flowers'
        },
        'quantity': 2
      },
      {
        'item': {
          'id': '5bb619e40fee29e3aaf09759',
          'weight': '18.4',
          'name': 'Donald Trump statue'
        },
        'quantity': 1
      }
    ],
    'status': 'à livrer',
    'tracking_id': 'bVCqBiRDOYbVLlk',
    'palette_number': 1,
    'weight': 28.9,
    'value': 10
  },
  {
    'order_id': '5bb61dfd3741808151aa413b',
    'items': [
      {
        'item': {
          'id': '5bb619e40fee29e3aaf09759',
          'weight': '18.4',
          'name': 'Donald Trump statue'
        },
        'quantity': 1
      }
    ],
    'status': 'à livrer',
    'tracking_id': 'zeztTsuUqHTOeAk',
    'palette_number': 1,
    'weight': 18.4,
    'value': 5
  },
  {
    'order_id': '5bb61dfd3741808151aa413b',
    'items': [
      {
        'item': {
          'id': '5bb619e40fee29e3aaf09759',
          'weight': '18.4',
          'name': 'Donald Trump statue'
        },
        'quantity': 1
      }
    ],
    'status': 'à livrer',
    'tracking_id': 'gbfkUEEdFBQnuwy',
    'palette_number': 1,
    'weight': 18.4,
    'value': 5
  },
  {
    'order_id': '5bb61dfd3741808151aa413b',
    'items': [
      {
        'item': {
          'id': '5bb619e40fee29e3aaf09759',
          'weight': '18.4',
          'name': 'Donald Trump statue'
        },
        'quantity': 1
      },
      {
        'item': {
          'id': '5bb619e4ebdccb9218aa9dcb',
          'weight': '8.4',
          'name': 'Chair'
        },
        'quantity': 1
      }
    ],
    'status': 'à livrer',
    'tracking_id': 'cZwulOSaEpBjIfx',
    'palette_number': 1,
    'weight': 26.8,
    'value': 10
  }
]

it('Test parcels visualiser', () => {
  const div = document.createElement('div')
  const wrapper = mount(<ParcelsVisualiser
    parcels={parcels}
  />, { attachTo: div })

  expect(wrapper.find('div.react-grid-Row'))
    .to.have.lengthOf(4)

})
