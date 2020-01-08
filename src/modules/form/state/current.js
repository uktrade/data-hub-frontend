const { get, set, keys, reduce, last, unset, isNil } = require('lodash')

const MULTI_STEP_KEY = 'multi-step'

const update = (
  session,
  journeyKey,
  path,
  { data, completed, addBrowseHistory, nextPath }
) => {
  const currentState = getCurrent(session, journeyKey)

  const stepDataKey = `steps.${path}.data`
  const stepData = {
    ...get(currentState, stepDataKey),
    ...data,
  }
  set(currentState, stepDataKey, stepData)

  if (!isNil(completed)) {
    set(currentState, `steps.${path}.completed`, completed)
  }

  if (addBrowseHistory) {
    const browseHistory = get(currentState, 'browseHistory', [])
    if (last(browseHistory) !== path) {
      browseHistory.push(path)
      set(currentState, 'browseHistory', browseHistory)
    }
  }

  if (nextPath) {
    set(currentState, `steps.${path}.nextPath`, nextPath)
  }
}

const getCurrent = (session, journeyKey) => {
  const sessionKey = `${MULTI_STEP_KEY}.${journeyKey}`

  if (!get(session, sessionKey)) {
    set(session, sessionKey, {})
  }

  return get(session, sessionKey)
}

const reduceSteps = (session, journeyKey) => {
  const currentState = getCurrent(session, journeyKey)
  const paths = keys(currentState.steps)

  return reduce(
    paths,
    (previousReduction, path) => {
      return {
        ...previousReduction,
        ...get(currentState, `steps.${path}.data`),
      }
    },
    {}
  )
}

const getField = (session, journeyKey, fieldName) => {
  const data = reduceSteps(session, journeyKey)
  return data[fieldName]
}

const remove = (session, journeyKey) => {
  const sessionKey = `${MULTI_STEP_KEY}.${journeyKey}`
  unset(session, sessionKey)
}

const removeStep = (session, journeyKey, stepPath) => {
  const currentState = getCurrent(session, journeyKey)
  unset(currentState, `steps.${stepPath}`)
}

module.exports = {
  update,
  getCurrent,
  reduceSteps,
  getField,
  remove,
  removeStep,
}
