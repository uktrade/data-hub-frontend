import React, { useEffect, useRef } from 'react'

/**
 * Makes a React component _focusable_ by adding the `focused` prop which when
 * set to `true` focuses the component's underlying DOM element imperatively on
 * render.
 * @function focusable
 * @param {React.Component} component - The component to be decorated. Note that
 * the component's root node must be able to take the `ref` prop.
 * @returs - A _focusable_ version of the component.
 */
export default (Component) => ({ focused, ...props }) => {
  const ref = useRef()
  useEffect(() => {
    focused && ref?.current?.focus()
  })

  return <Component ref={ref} {...props} />
}
