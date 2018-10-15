const { getFullRoute } = require('../helpers')

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
}
