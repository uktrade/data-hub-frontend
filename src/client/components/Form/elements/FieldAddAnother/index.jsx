import React from 'react'

import MultiInstanceFieldAddAnother from './FieldAddAnother'

const FieldAddAnother = ({ id, name, ...props }) => (
  <MultiInstanceFieldAddAnother
    id={id ? id : `${name}-field-add-another`}
    name={name}
    {...props}
  />
)

export default FieldAddAnother
