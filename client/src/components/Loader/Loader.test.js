import React from 'react'
import ReactDOM from 'react-dom'
import Loader from './index'
import { mount } from 'enzyme'

it('Test parcels visualiser', () => {
  const div = document.createElement('div')
  const wrapper = mount(<Loader
    loading={true}
  />, { attachTo: div })

  expect(wrapper.find('div.loader'))
    .to.have.lengthOf(1)

})
