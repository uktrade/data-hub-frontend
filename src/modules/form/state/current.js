const {
  get,
  set,
  keys,
  reduce,
  last,
  unset,
  isNil,
} = require('lodash')

const MULTI_STEP_KEY = 'multi-step'

const update = (session, journeyKey, path, { data, completed, addBrowseHistory }) => {
  const currentState = getCurrent(session, journeyKey)

  const stepDataKey = `steps.${path}.data`
  const stepData = {
    ...data,
    ...get(currentState, stepDataKey),
  }
  set(currentState, stepDataKey, stepData)

  if (!isNil(completed)) {
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

const reduceSteps = (session, journeyKey) => {
  const currentState = getCurrent(session, journeyKey)
  const paths = keys(currentState.steps)

  return reduce(paths, (previousReduction, path) => {
    return {
      ...previousReduction,
      ...get(currentState, `steps.${path}.data`),
    }
  }, {})
}

const getField = (session, journeyKey, fieldName) => {
  const data = reduceSteps(session, journeyKey)
  return data[fieldName]
}

const remove = (session, journeyKey) => {
  const sessionKey = `${MULTI_STEP_KEY}.${journeyKey}`
  unset(session, sessionKey)
}

module.exports = {
  update,
  getCurrent,
  reduceSteps,
  getField,
  remove,
}
