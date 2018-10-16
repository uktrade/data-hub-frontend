const {
  isEmpty,
  get,
  set,
  map,
  compact,
  find,
  reduce,
} = require('lodash')

const state = require('../state/current')
const { getFullRoute, getNextPath } = require('../helpers')

const mapStepsWithState = (steps, currentState) => {
  return compact(map(steps, (step, stepId) => {
    const completed = get(currentState, `steps.${step.path}.completed`, false)
    const data = get(currentState, `steps.${step.path}.data`, {})

    return {
      completed,
      id: stepId,
      path: step.path,
      nextPath: getNextPath(step, data),
      validateJourney: step.validateJourney,
    }
  }))
}

const isValidJourney = (steps, currentStepId, currentState) => {
  const stepsWithState = mapStepsWithState(steps, currentState)

  const hasCompletedPreviousStep = (step) => {
    if (step.id === 0 || step.validateJourney === false) {
      return true
    }

    const previousStep = find(stepsWithState, stepWithState => stepWithState.nextPath === step.path)
    return previousStep && previousStep.completed ? hasCompletedPreviousStep(previousStep) : false
  }

  const currentStepWithState = find(stepsWithState, stepWithState => stepWithState.id === currentStepId)
  return hasCompletedPreviousStep(currentStepWithState)
}

const reduceStepsData = (steps, currentState) => {
  return reduce(steps, (previousReduction, { path }) => {
    return {
      ...previousReduction,
      ...get(currentState, `steps.${path}.data`),
    }
  }, {})
}

const validateState = (req, res, next) => {
  const { key, steps, currentStepId } = res.locals.journey
  const currentState = state.getCurrent(req.session, key)
  const isStartingJourney = isEmpty(currentState.steps) && currentStepId === 0

  if (isStartingJourney) {
    return next()
  }

  if (isValidJourney(steps, currentStepId, currentState)) {
    return next()
  }

  res.redirect(key)
}

const updateStateData = (req, res, next) => {
  const { key, currentStep } = res.locals.journey
  const currentStepPath = currentStep.path

  state.update(req.session, key, currentStepPath, { data: req.body })

  next()
}

const updateStateBrowseHistory = (req, res, next) => {
  const { key, currentStep } = res.locals.journey
  const currentStepPath = currentStep.path

  state.update(req.session, key, currentStepPath, { addBrowseHistory: true })

  next()
}

const setFormDetails = (req, res, next) => {
  const { key, steps } = res.locals.journey
  const currentState = state.getCurrent(req.session, key)

  set(res.locals, 'form.state', reduceStepsData(steps, currentState))

  if (currentState.browseHistory) {
    const previousPath = currentState.browseHistory[currentState.browseHistory.length - 1]
    const returnStep = find(steps, step => step.path === previousPath)

    set(res.locals, 'form.returnLink', getFullRoute(req.baseUrl, returnStep))
    set(res.locals, 'form.returnText', 'Back')
  } else {
    set(res.locals, 'form.returnLink', req.baseUrl)
    set(res.locals, 'form.returnText', 'Cancel')
  }

  next()
}

const setJourneyDetails = (journey, currentStep, currentStepId) => {
  return (req, res, next) => {
    res.locals.journey = {
      currentStep,
      currentStepId,
      ...journey,
      key: getFullRoute(req.baseUrl, journey.steps[0]),
    }

    next()
  }
}

module.exports = {
  setJourneyDetails,
  validateState,
  updateStateData,
  updateStateBrowseHistory,
  setFormDetails,
}
