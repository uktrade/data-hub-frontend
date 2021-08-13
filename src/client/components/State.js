import React from 'react'
import { connect } from 'react-redux'

/**
 * @function State
 * A React component which allows you to read the whole Redux state declaratively
 * @property {Object} props
 * @property {state => React.ReactNode} props.children - The component accepts
 * a function as it's single child, which will be passed the whole Redux state
 * and whose return value will be rendered by the component.
 */
export default connect((state) => ({ state }))(
  ({ state, children: Children }) => <Children {...state} />
)
