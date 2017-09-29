const { assign, get, flatten } = require('lodash')
const { updateInvestment } = require('../../repos')
const { requirementsFormConfig } = require('../../macros')
const { buildFormWithStateAndErrors } = require('../../../builders')

function populateForm (req, res, next) {
  const investmentData = assign({}, res.locals.investmentData, {
    strategic_drivers: get(res.locals, 'investmentData.strategic_drivers[0].id'),
    competitor_countries: get(res.locals, 'investmentData.competitor_countries[0].id'),
    uk_region_locations: get(res.locals, 'investmentData.uk_region_locations[0].id'),
  })

  res.locals.requirementsForm = assign(
    buildFormWithStateAndErrors(requirementsFormConfig, investmentData),
    { returnLink: `/investment-projects/${investmentData.id}` },
  )

  next()
}

function handleFormPost (req, res, next) {
  res.locals.projectId = req.params.id

  const formattedBody = assign({}, req.body, {
    strategic_drivers: flatten([req.body.strategic_drivers]),
    competitor_countries: req.body.client_considering_other_countries === 'true' ? flatten([req.body.competitor_countries]) : [],
    uk_region_locations: flatten([req.body.uk_region_locations]),
  })

  updateInvestment(req.session.token, res.locals.projectId, formattedBody)
    .then(() => next())
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.requirementsForm = buildFormWithStateAndErrors(requirementsFormConfig, req.body, err.error)

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
