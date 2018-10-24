const { isEmpty, set, forEach } = require('lodash')

const { getFullRoute, getNextPath } = require('./helpers')
const state = require('./state/current')
const { getErrors } = require('./errors')

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

const postDetails = async (req, res, next) => {
  const { currentStep, key, successMessage } = res.locals.journey
  const errors = getErrors(currentStep.macro(res.locals).children, req.body)

  if (!isEmpty(errors)) {
    set(res.locals, 'form.errors.messages', errors)
    state.update(req.session, key, currentStep.path, { completed: false })
    return next()
  }

  if (currentStep.send) {
    const data = state.reduceSteps(req.session, key)
    await currentStep.send(data, (err) => {
      if (err) {
        state.update(req.session, key, currentStep.path, { completed: false })
        if (err.statusCode === 400) {
          set(res.locals, 'form.errors.messages', err.error)
          return next()
        } else {
          return next(err)
        }
      }

      state.remove(req.session, key)
      req.flash('success', successMessage)
      res.redirect(req.baseUrl + getNextPath(currentStep, req.body))
    })
  } else {
    state.update(req.session, key, currentStep.path, { completed: true })
    res.redirect(req.baseUrl + getNextPath(currentStep, req.body))
  }
}

const setBreadcrumbs = (req, res, next) => {
  const breadcrumbs = [
    ...(res.locals.journey.breadcrumbs || []),
    ...(res.locals.journey.currentStep.breadcrumbs || []),
  ]

  forEach(breadcrumbs, (breadcrumb) => {
    res.breadcrumb(breadcrumb.name, breadcrumb.url)
  })

  next()
}

module.exports = {
  setJourneyDetails,
  postDetails,
  setBreadcrumbs,
}
