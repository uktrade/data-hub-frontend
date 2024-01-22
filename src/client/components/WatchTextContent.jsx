import React, { useEffect, useRef } from 'react'

/**
 * @function WatchTextContent
 * @description Calls {onTextContentChange} anytime the `textContent`
 * of {children} changes. The {children} won't be rendered.
 * @param {Object} props
 * @param {React.Children} props.children - Children
 * @param {(textContent: string) => void} props.onTextContentChange - A callback that will
 * be called anytime the `textContent` of this component changes with the value
 * of the current `textContent`.
 */
const WatchTextContent = ({ onTextContentChange, ...props }) => {
  const ref = useRef()
  const previousTextContent = useRef()

  useEffect(() => {
    previousTextContent.current = ref.current.textContent

    // Detach the element so that the content is not searchable by Cypress tests.
    // This is the only way to make an element really hidden from Cypress.
    ref.current?.remove()

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

  return <div ref={ref} {...props} hidden={true} />
}

export default WatchTextContent
