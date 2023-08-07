// Taken and adapted from: https://github.com/melanieseltzer/react-use-caret-position
import { useCallback, useEffect, useRef, useState } from 'react'

const TEXT = 'text'

export const useTextCaretPosition = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const inputRef = useRef(null)

  const updateTextCaret = useCallback(() => {
    // At this stage users are only complaining about text. If we wanted to apply
    // the same logic to an input where the type is number we would have to convert
    // all of those elements to text and apply a regex that only accepts numbers.
    if (inputRef.current.type === TEXT) {
      const { selectionStart, selectionEnd } = inputRef.current
      setStart(selectionStart)
      setEnd(selectionEnd)
    }
  }, [])

  useEffect(() => {
    if (inputRef.current.type === TEXT) {
      inputRef.current.setSelectionRange(start, end)
    }
  })

  return { start, end, ref: inputRef, updateTextCaret }
}
