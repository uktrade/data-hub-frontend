const KEY = 'flash-messages'

const getMessages = () => {
  const items = window.sessionStorage.getItem(KEY)
  if (items) {
    try {
      return JSON.parse(items)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Cannot get messages from session storage', e)
    }
  }
  return {}
}

const addMessage = (messageType, message) => {
  const messages = getMessages()
  messages[messageType] = messages[messageType] || []
  messages[messageType].push(message)
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(messages))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Cannot set messages to session storage', e)
  }
}

const addMessageWithBody = (type, heading, body) => {
  addMessage(`${type}:with-body`, { heading, body })
}

const clearMessages = () => window.sessionStorage.removeItem(KEY)

module.exports = {
  addMessage,
  getMessages,
  addMessageWithBody,
  clearMessages,
}
