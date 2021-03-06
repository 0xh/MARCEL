//@flow
import React from 'react'

import './OccupationIndicator.css'

type PropTypes = {
  isOccupied: boolean,
}

const OccupationIndicator = (props: PropTypes) => {
  const { isOccupied } = props
  return (
    <div className="OccupationIndicator">
      <div className={`indicator ${isOccupied ? 'occupied' : ''}`} />
    </div>
  )
}

export default OccupationIndicator
