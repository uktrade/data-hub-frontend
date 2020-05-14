const KEY = 'flash-messages'

function getMessages() {
  const items = window.sessionStorage.getItem(KEY)
  if (items) {
    try {
      return JSON.parse(items)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e) // TODO: replace with more robust error logging when implemented
    }
  }
  return {}
}

function addMessage(messageType, message) {
  const messages = getMessages()
  messages[messageType] = messages[messageType] || []
  messages[messageType].push(message)
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(messages))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e) // TODO: replace with more robust error logging when implemented
  }
}

function addSuccessMessage(message) {
  addMessage('success', message)
}

function clearMessages() {
  window.sessionStorage.removeItem(KEY)
}

module.exports = {
  getMessages,
  addMessage,
  addSuccessMessage,
  clearMessages,
}
