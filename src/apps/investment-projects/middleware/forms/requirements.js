const { assign, flatten } = require('lodash')
const { updateInvestment } = require('../../repos')
const { requirementsFormConfig } = require('../../macros')
const {
  buildFormWithStateAndErrors,
  buildFormWithState,
} = require('../../../builders')

function populateForm (req, res, next) {
  const investmentData = res.locals.investmentData

  res.locals.requirementsForm = assign(
    buildFormWithStateAndErrors(requirementsFormConfig, investmentData),
    { returnLink: `/investment-projects/${investmentData.id}` },
  )

  next()
}

// Strips out empty entries so they are not posted (which result in errors)
// and when an error is thrown it doesn't mean yet another is added
function cleanArray (values) {
  return flatten([values])
    .filter(item => item)
}

function handleFormPost (req, res, next) {
  res.locals.projectId = req.params.investmentId

  const formattedBody = assign({}, req.body, {
    strategic_drivers: cleanArray(req.body.strategic_drivers),
    competitor_countries: req.body.client_considering_other_countries === 'true' ? cleanArray(req.body.competitor_countries) : [],
    uk_region_locations: cleanArray(req.body.uk_region_locations),
  })

  if (req.body.add_item) {
    res.locals.requirementsForm = buildFormWithState(requirementsFormConfig, formattedBody)
    return next()
  }

  updateInvestment(req.session.token, res.locals.projectId, formattedBody)
    .then(() => next())
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.requirementsForm = buildFormWithStateAndErrors(requirementsFormConfig, formattedBody, err.error)

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
