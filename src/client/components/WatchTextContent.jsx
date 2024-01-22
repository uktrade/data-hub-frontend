import { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

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
    ref.current = document.createElement('div')
    return () => {
      ref.current.remove()
    }
  }, [])

  useEffect(() => {
    ReactDOM.render(props.children, ref.current)
    // The most recent update only takes effect in the next event tick
    setTimeout(() => {
      if (ref.current.textContent !== previousTextContent.current) {
        onTextContentChange(ref.current.textContent)
        previousTextContent.current = ref.current.textContent
      }
    }, 0)
  })

  return null
}

export default WatchTextContent
