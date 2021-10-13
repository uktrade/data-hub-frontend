import PropTypes from 'prop-types'
import { useEffect } from 'react'

import { addMessage, addMessageWithBody } from '../utils/flash-messages'

// FIXME: Add docstring and types
const FlashMessage = ({ when, type, template, context }) => {
  useEffect(() => {
    if (when) {
      const message = template(context)
      Array.isArray(message)
        ? addMessageWithBody(type, ...message)
        : addMessage(type, message)
    }
  }, [when])
  return null
}

FlashMessage.propTypes = {
  when: PropTypes.any,
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  template: PropTypes.func.isRequired,
  context: PropTypes.any,
}

export default FlashMessage
