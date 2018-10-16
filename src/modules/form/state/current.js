const { get, set, last } = require('lodash')

const MULTI_STEP_KEY = 'multi-step'

const update = (session, journeyKey, path, { data, completed, addBrowseHistory }) => {
  const currentState = getCurrent(session, journeyKey)

  const stepDataKey = `steps.${path}.data`
  const stepData = {
    ...data,
    ...get(currentState, stepDataKey),
  }
  set(currentState, stepDataKey, stepData)

  if (completed) {
    const pathCompletedKey = `steps.${path}.completed`
    set(currentState, pathCompletedKey, completed)
  }

  if (addBrowseHistory) {
    const browseHistory = get(currentState, 'browseHistory', [])
    if (last(browseHistory) !== path) {
      browseHistory.push(path)
      set(currentState, 'browseHistory', browseHistory)
    }
  }

  const sessionKey = `${MULTI_STEP_KEY}.${journeyKey}`
  set(session, sessionKey, currentState)
}

const getCurrent = (session, journeyKey) => {
  const sessionKey = `${MULTI_STEP_KEY}.${journeyKey}`
  return get(session, sessionKey, {})
}

module.exports = {
  update,
  getCurrent,
}
