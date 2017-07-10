const { get, flatten } = require('lodash')

const metadataRepo = require('../../../lib/metadata')
const { getAdvisers } = require('../../adviser/repos')
const interactionFormattingService = require('../../interactions/services/formatting')
const {
  interactionsLabels,
  requirementsLabels,
} = require('../labels')
const {
  createInvestmentInteraction,
  updateInvestmentInteraction,
} = require('../../interactions/repos')
const { updateInvestment } = require('../repos')

function populateRequirementsFormMiddleware (req, res, next) {
  res.locals.form = get(res, 'locals.form', {})
  res.locals.form.labels = requirementsLabels.edit
  res.locals.form.state = res.locals.investmentData

  res.locals.form.options = {
    countryOptions: metadataRepo.countryOptions,
    regionOptions: metadataRepo.regionOptions,
    strategicDriverOptions: metadataRepo.strategicDriverOptions,
  }

  next()
}

async function populateInteractionsFormMiddleware (req, res, next) {
  try {
    const interactionTypes = metadataRepo.interactionTypeOptions
    const advisersResponse = await getAdvisers(req.session.token)
    const contacts = res.locals.investmentData.client_contacts

    const advisers = advisersResponse.results.map((adviser) => {
      return {
        id: adviser.id,
        name: `${adviser.first_name} ${adviser.last_name}`,
      }
    })

    res.locals.form = get(res, 'locals.form', {})
    res.locals.form.labels = interactionsLabels.edit
    res.locals.form.state = res.locals.interaction
    res.locals.form.options = {
      advisers,
      contacts,
      interactionTypes,
    }

    next()
  } catch (error) {
    next(error)
  }
}

function interactionDetailsFormPostMiddleware (req, res, next) {
  const formattedBody = interactionFormattingService.transformToApi(req.body)
  const interactionId = req.params.interactionId
  let saveMethod

  if (interactionId) {
    saveMethod = updateInvestmentInteraction(req.session.token, interactionId, formattedBody)
  } else {
    saveMethod = createInvestmentInteraction(req.session.token, formattedBody)
  }

  saveMethod
    .then((result) => {
      res.locals.resultId = result.id
      next()
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.form = get(res, 'locals.form', {})
        res.locals.form.errors = err.error
        res.locals.form.state = req.body

        next()
      } else {
        next(err)
      }
    })
}

function investmentRequirementsFormPostMiddleware (req, res, next) {
  res.locals.projectId = req.params.id

  const formattedBody = Object.assign({}, req.body, {
    strategic_drivers: flatten([req.body.strategic_drivers]),
    competitor_countries: flatten([req.body.competitor_countries]),
    uk_region_locations: flatten([req.body.uk_region_locations]),
  })

  updateInvestment(req.session.token, res.locals.projectId, formattedBody)
  .then(() => next())
  .catch((err) => {
    if (err.statusCode === 400) {
      res.locals.form = get(res, 'locals.form', {})
      res.locals.form.errors = err.error
      res.locals.form.state = req.body

      next()
    } else {
      next(err)
    }
  })
}

module.exports = {
  investmentRequirementsFormPostMiddleware,
  interactionDetailsFormPostMiddleware,
  populateInteractionsFormMiddleware,
  populateRequirementsFormMiddleware,
}
