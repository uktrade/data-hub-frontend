const { get } = require('lodash')

const metadataRepo = require('../../../../lib/metadata')
const { getAdvisers } = require('../../../adviser/repos')
const interactionFormattingService = require('../../../interactions/services/formatting')
const { interactionsLabels } = require('../../labels')
const { transformObjectToOption } = require('../../../transformers')
const {
  createInvestmentInteraction,
  updateInvestmentInteraction,
} = require('../../../interactions/repos')

async function populateForm (req, res, next) {
  try {
    const interactionTypes = metadataRepo.interactionTypeOptions
    const advisersResponse = await getAdvisers(req.session.token)
    const contacts = res.locals.investmentData.client_contacts
    const advisers = advisersResponse.results.map(transformObjectToOption)

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

function handleFormPost (req, res, next) {
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

module.exports = {
  populateForm,
  handleFormPost,
}
