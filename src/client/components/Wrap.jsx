import React from 'react'

/**
 * @function Wrap
 * @description Wraps children in a component specified in the {with} prop
 * if the {when} condition is met.
 * @param {Object} props
 * @param {(props: Object) => React.ReactNode} props.with - The wrapping component.
 * @param {any} props.when - Wrapping takes place only if this prop is truthy,
 * otherwise the children will be rendered unwrapped
 * @param {Object} props.props - Will be passed as the props to the wrapping
 * component.
 * @param {React.ReactNode} props.props - The children to be wrapped
 * @returns {React.ReactNode}
 * @example
 * <Wrap with="span" when={true} props={{style: {color: 'red'}}}>
 *   <h1>I'm gonna be wrapped</h1>
 * </Wrap>
 */
const Wrap = ({ with: With, when, children, props }) =>
  when ? (
    <With {...props} children={children} />
  ) : typeof children === 'function' ? (
    children()
  ) : (
    children
  )

export default Wrap
