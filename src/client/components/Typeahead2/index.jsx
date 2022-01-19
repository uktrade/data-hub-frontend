// TODO: RR-237 - this should become the default Typeahead and
// moved from Typeahead2 to Typeahead
import React from 'react'

import MultiInstanceTypeahead from './Typeahead'

const Typeahead = ({ id, name, ...props }) => (
  <MultiInstanceTypeahead
    id={id ? id : `${name}-typeahead`}
    name={name}
    {...props}
  />
)

export default Typeahead
