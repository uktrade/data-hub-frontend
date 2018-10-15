const {
  isEmpty,
  get,
  map,
  compact,
  find,
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
}
