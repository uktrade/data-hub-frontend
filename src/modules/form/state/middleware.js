const {
  isEmpty,
  get,
  set,
  map,
  compact,
  find,
  keys,
  indexOf,
  union,
  filter,
  includes,
} = require('lodash')

const state = require('../state/current')
const { getNextPath } = require('../helpers')
const { joinPaths } = require('../../../lib/path')

const mapStepsWithState = (steps, currentState) => {
  return compact(
    map(steps, (step, stepId) => {
      const completed = get(currentState, `steps.${step.path}.completed`, false)
      const data = get(currentState, `steps.${step.path}.data`, {})

      return {
        completed,
        id: stepId,
        path: step.path,
        nextPath: getNextPath(step, data),
        validateJourney: step.validateJourney,
      }
    })
  )
}

const isValidJourney = (steps, currentStepId, currentState) => {
  const stepsWithState = mapStepsWithState(steps, currentState)

  const hasCompletedPreviousStep = (step) => {
    if (step.id === 0 || step.validateJourney === false) {
      return true
    }

    const previousStep = find(
      stepsWithState,
      (stepWithState) => stepWithState.nextPath === step.path
    )
    return previousStep && previousStep.completed
      ? hasCompletedPreviousStep(previousStep)
      : false
  }

  const currentStepWithState = find(
    stepsWithState,
    (stepWithState) => stepWithState.id === currentStepId
  )
  return hasCompletedPreviousStep(currentStepWithState)
}

function getDifference(object1, object2) {
  const allKeys = union(keys(object1), keys(object2))
  return filter(allKeys, (key) => object1[key] !== object2[key])
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

  state.update(req.session, key, currentStep.path, { data: req.body })

  next()
}

const updateStateBrowseHistory = (req, res, next) => {
  const { key, currentStep } = res.locals.journey

  state.update(req.session, key, currentStep.path, { addBrowseHistory: true })

  next()
}

const setFormDetails = (req, res, next) => {
  const { key, steps, currentStepId } = res.locals.journey
  const currentState = state.getCurrent(req.session, key)

  set(res.locals, 'form.state', state.reduceSteps(req.session, key))

  if (currentState.browseHistory && currentStepId !== 0) {
    const isPresentingErrors = !isEmpty(res.locals.form.errors)
    const browseHistoryIndex =
      currentState.browseHistory.length - (isPresentingErrors ? 2 : 1)
    const previousPath = currentState.browseHistory[browseHistoryIndex]
    const returnStep = find(steps, (step) => step.path === previousPath)

    set(
      res.locals,
      'form.returnLink',
      joinPaths([req.baseUrl, returnStep.path])
    )
    set(res.locals, 'form.returnText', 'Back')
  } else {
    set(res.locals, 'form.returnLink', req.baseUrl)
    set(res.locals, 'form.returnText', 'Cancel')
  }

  next()
}

const invalidateStateForDependentSteps = (req, res, next) => {
  const { currentStep, key, steps } = res.locals.journey
  const currentState = state.getCurrent(req.session, key)
  const stepState = get(currentState, `steps.${currentStep.path}.data`, {})
  const difference = getDifference(stepState, req.body)

  difference.forEach((differentField) => {
    steps.forEach((step) => {
      if (step.macro && includes(step.macro({}).dependsOn, differentField)) {
        state.removeStep(req.session, key, step.path)
      }
    })
  })

  next()
}

const invalidateStateForChangedNextPath = (req, res, next) => {
  const { currentStep, key } = res.locals.journey
  const currentState = state.getCurrent(req.session, key)
  const currentNextPath = get(
    currentState,
    `steps.${currentStep.path}.nextPath`
  )
  const newNextPath = getNextPath(currentStep, req.body)
  const hasChangedNextPath =
    currentNextPath && newNextPath && currentNextPath !== newNextPath

  if (hasChangedNextPath) {
    const stepPathsInState = keys(currentState.steps)
    const indexOfCurrentStepInState = indexOf(
      stepPathsInState,
      currentStep.path
    )

    stepPathsInState.forEach((stepPath, stepPathIndex) => {
      if (stepPathIndex > indexOfCurrentStepInState) {
        state.removeStep(req.session, key, stepPath)
      }
    })
  }

  next()
}

module.exports = {
  validateState,
  updateStateData,
  updateStateBrowseHistory,
  setFormDetails,
  invalidateStateForDependentSteps,
  invalidateStateForChangedNextPath,
}
