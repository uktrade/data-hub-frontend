const { assign, flatten, get } = require('lodash')

const { updateInvestment } = require('../../repos')
const { requirementsFormConfig } = require('../../macros')
const { getOptions } = require('../../../../lib/options')
const {
  buildFormWithStateAndErrors,
  buildFormWithState,
} = require('../../../builders')

async function getFormOptions (token, createdOn) {
  return {
    strategicDrivers: await getOptions(token, 'investment-strategic-driver', { createdOn }),
    countries: await getOptions(token, 'country', { createdOn }),
    ukRegions: await getOptions(token, 'uk-region', { createdOn }),
  }
}

async function populateForm (req, res, next) {
  try {
    const investmentData = res.locals.investmentData

    const createdOn = get(res.locals.investmentData, 'created_on')
    res.locals.options = await getFormOptions(req.session.token, createdOn)

    res.locals.requirementsForm = assign({},
      buildFormWithStateAndErrors(requirementsFormConfig(res.locals.options), investmentData),
      { returnLink: `/investment-projects/${investmentData.id}` },
    )
  } catch (error) {
    return next(error)
  }

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
    res.locals.requirementsForm = buildFormWithState(requirementsFormConfig(res.locals.options), formattedBody)
    return next()
  }

  updateInvestment(req.session.token, res.locals.projectId, formattedBody)
    .then(() => next())
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.requirementsForm = buildFormWithStateAndErrors(requirementsFormConfig(res.locals.options), formattedBody, err.error)

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
