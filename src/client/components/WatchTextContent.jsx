import React, { useEffect, useRef } from 'react'

/**
 * @function WatchTextContent
 * @description Calls {onTextContentChange} anytime the `textContent`
 * of this component changes.
 * @param {Object} props
 * @param {React.Children} props.children - Children
 * @param {(textContent: string) => void} props.onTextContentChange - A callback that will
 * be called anytime the `textContent` of this component changes with the value
 * of the current `textContent`.
 * @param {string} [props.as = 'div'] - What should be the wrapping element
 */
const WatchTextContent = ({
  onTextContentChange,
  as: As = 'div',
  ...props
}) => {
  const ref = useRef()
  const previousTextContent = useRef()

  useEffect(() => {
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

  return <As {...props} ref={ref} />
}

export default WatchTextContent
