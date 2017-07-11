const { get, flatten } = require('lodash')
const { requirementsLabels } = require('../../labels')
const metadataRepo = require('../../../../lib/metadata')
const { updateInvestment } = require('../../repos')

function populateForm (req, res, next) {
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

function handleFormPost (req, res, next) {
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
  populateForm,
  handleFormPost,
}
