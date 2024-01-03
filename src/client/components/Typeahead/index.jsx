import React from 'react'

import MultiInstanceTypeahead from './Typeahead'

const Typeahead = ({ id, name, ...props }) => {
  return (
    <MultiInstanceTypeahead
      id={id ? id : `${name}-typeahead`}
      name={name}
      {...props}
    />
  )
}

export default Typeahead
