import React from 'react'

// FIXME: Add docstring and types
const Wrap = ({ with: With, when, children, props }) =>
  when ? (
    <With {...props} children={children} />
  ) : typeof children === 'function' ? (
    children()
  ) : (
    children
  )

export default Wrap
