import PropTypes from 'prop-types'
import { useEffect } from 'react'

import { addMessage, addMessageWithBody } from '../utils/flash-messages'

/**
 * @function FlashMessage
 * @description Allows for registering a Flash message declaratively in JSX.
 * Please reffer to the `../utils/flash-messages` module for what exactly
 * is happening when a flash message is registered.
 * @param {Object} props
 * @param {any} props.when - If truthy, {props.template} will be called with the
 * {props.context} and a flash message will be registered.
 * @param {string} props.type - The flash message type e.g. `"success"`.
 * @param {(context: any) => string | [string, string]} props.type - A function
 * that will be passed {props.context} and which should return a string or a
 * tuple of two strings representing a simple flash message or a flash message
 * with heading respectively.
 * @param {any} props.context - The context passed to {props.template}.
 * @param {any} [props.children=null] - The component will just render it's
 * children.
 * @returns {React.ReactNode}
 */
const FlashMessage = ({ when, type, template, context, children = null }) => {
  useEffect(() => {
    if (when) {
      const message = template(context)
      Array.isArray(message)
        ? addMessageWithBody(type, ...message)
        : addMessage(type, message)
    }
  }, [when])
  return children
}

FlashMessage.propTypes = {
  when: PropTypes.any,
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  template: PropTypes.func.isRequired,
  context: PropTypes.any,
}

export default FlashMessage
