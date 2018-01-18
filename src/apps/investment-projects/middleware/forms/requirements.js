const { assign, castArray, compact, get } = require('lodash')

const { updateInvestment } = require('../../repos')
const { requirementsFormConfig } = require('../../macros')
const { getOptions } = require('../../../../lib/options')
const { buildFormWithStateAndErrors } = require('../../../builders')

async function getFormOptions (token, createdOn) {
  return {
    strategicDrivers: await getOptions(token, 'investment-strategic-driver', { createdOn }),
    countries: await getOptions(token, 'country', { createdOn }),
    ukRegions: await getOptions(token, 'uk-region', { createdOn }),
  }
}

function formatBody (body) {
  return assign({}, body, {
    strategic_drivers: compact(castArray(body.strategic_drivers)),
    competitor_countries: body.client_considering_other_countries === 'true' ? compact(castArray(body.competitor_countries)) : [],
    uk_region_locations: compact(castArray(body.uk_region_locations)),
    actual_uk_regions: body.site_decided === 'true' ? compact(castArray(body.actual_uk_regions)) : [],
  })
}

async function populateForm (req, res, next) {
  try {
    const investmentId = req.params.investmentId
    const investmentData = res.locals.investmentData
    const createdOn = get(res.locals.investmentData, 'created_on')
    const options = await getFormOptions(req.session.token, createdOn)
    const body = res.locals.formattedBody || investmentData

    res.locals.requirementsForm = assign({},
      buildFormWithStateAndErrors(requirementsFormConfig(options), body, res.locals.errors),
      { returnLink: `/investment-projects/${investmentId}` },
    )
  } catch (error) {
    return next(error)
  }

  next()
}

async function handleFormPost (req, res, next) {
  try {
    const investmentId = req.params.investmentId

    res.locals.formattedBody = formatBody(req.body)

    if (req.body.add_item) {
      return next()
    }

    await updateInvestment(req.session.token, investmentId, res.locals.formattedBody)
    req.flash('success', 'Investment requirements updated')
    res.redirect(`/investment-projects/${investmentId}/details`)
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.errors = err.error
      next()
    } else {
      next(err)
    }
  }
}

module.exports = {
  populateForm,
  handleFormPost,
}
