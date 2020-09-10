const { assign } = require('lodash')

const castCompactArray = require('../../../../lib/cast-compact-array')
const { updateInvestment } = require('../../repos')
const { requirementsFormConfig } = require('../../macros')
const { getOptions } = require('../../../../lib/options')
const { buildFormWithStateAndErrors } = require('../../../builders')

async function getFormOptions(req, createdOn) {
  return {
    strategicDrivers: await getOptions(req, 'investment-strategic-driver', {
      createdOn,
    }),
    countries: await getOptions(req, 'country', { createdOn }),
    ukRegions: await getOptions(req, 'uk-region', { createdOn }),
    partners: await getOptions(req, 'investment-delivery-partner', {
      createdOn,
    }),
  }
}

function formatBody(body) {
  return assign({}, body, {
    strategic_drivers: castCompactArray(body.strategic_drivers),
    competitor_countries:
      body.client_considering_other_countries === 'true'
        ? castCompactArray(body.competitor_countries)
        : [],
    uk_region_locations: castCompactArray(body.uk_region_locations),
    actual_uk_regions:
      body.site_decided === 'true'
        ? castCompactArray(body.actual_uk_regions)
        : [],
    delivery_partners: castCompactArray(body.delivery_partners),
  })
}

async function populateForm(req, res, next) {
  try {
    const { investment } = res.locals
    const { projects } = res.locals.paths
    const options = await getFormOptions(req, investment.created_on)
    const body = res.locals.formattedBody || investment

    res.locals.requirementsForm = assign(
      {},
      buildFormWithStateAndErrors(
        requirementsFormConfig(options),
        body,
        res.locals.errors
      ),
      { returnLink: `${projects}/${investment.id}` }
    )
  } catch (error) {
    return next(error)
  }

  next()
}

async function handleFormPost(req, res, next) {
  try {
    const { projects } = res.locals.paths
    const { investmentId } = req.params

    res.locals.formattedBody = formatBody(req.body)

    if (req.body.add_item) {
      return next()
    }

    await updateInvestment(req, investmentId, res.locals.formattedBody)
    req.flash('success', 'Investment requirements updated')
    res.redirect(`${projects}/${investmentId}/details`)
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
