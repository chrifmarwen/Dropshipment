import React from 'react'
import PropTypes from 'prop-types'

const Loader = ({ loading }) => {
  if (loading)
    return <div className="loader" />
  return <div />
}

Loader.propTypes = {
  loading: PropTypes.bool.isRequired
}

Loader.defaultProps = {
  loading: false
}

export default Loader
