import React from 'react'

const Loader = ({ loading }) => {
  if (loading)
    return <div className="loader" />
  return <div />
}

export default Loader
