const { get } = require('lodash')

const {
  detailsLabels,
  valueLabels,
  requirementsLabels,
} = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')
const {
  transformProjectDataForView,
  transformProjectValueForView,
  transformProjectRequirementsForView,
} = require('../services/formatting')

function detailsGetHandler (req, res, next) {
  if (get(res, 'locals.projectData')) {
    const transformedDetails = transformProjectDataForView(res.locals.projectData)
    const transformedValue = transformProjectValueForView(res.locals.valueData)
    const transformedRequirements = transformProjectRequirementsForView(res.locals.requirementsData)

    return res.render('investment/details', {
      details: getDataLabels(transformedDetails, detailsLabels.view),
      values: getDataLabels(transformedValue, valueLabels.view),
      requirements: getDataLabels(transformedRequirements, requirementsLabels.view),
      currentNavItem: 'details',
    })
  }
  return next()
}

function redirectToDetails (req, res) {
  res.redirect(`/investment/${req.params.id}/details`)
}

module.exports = {
  redirectToDetails,
  detailsGetHandler,
}
