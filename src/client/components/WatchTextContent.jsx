import React, { useEffect, useRef } from 'react'

/**
 * @function WatchTextContent
 * @description Calls {onTextContentChange} anytime the `textContent`
 * of {children} changes. The {children} will be rendered hidden.
 * @param {Object} props
 * @param {React.Children} props.children - Vdom to whose changes the component subscribes to.
 * It will be rendered in a hidden div.
 * @param {(textContent: string) => void} props.onTextContentChange - A callback that will
 * be called anytime the `textContent` of this component changes with the value
 * of the current `textContent`.
 */
const WatchTextContent = ({ onTextContentChange, ...props }) => {
  const ref = useRef()
  const previousTextContent = useRef()

  useEffect(() => {
    // Detach the element so that the content is not searchable by Cypress tests.
    // This is the only way to make an element really hidden from Cypress.
    ref.current.remove()

    onTextContentChange(ref.current.textContent)
    previousTextContent.current = ref.current.textContent

    const observer = new MutationObserver(() => {
      if (ref.current.textContent !== previousTextContent.current) {
        onTextContentChange(ref.current.textContent)
        previousTextContent.current = ref.current.textContent
      }
    })

    if (ref.current) {
      observer.observe(ref.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    // This wrapper is necessary because if we remove topmost element returned from render,
    // React would throw a NotFoundError.
    <div hidden={true}>
      <div ref={ref} {...props} />
    </div>
  )
}

export default WatchTextContent
