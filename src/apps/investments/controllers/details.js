const { get, pickBy, isNotEmpty, keys, has } = require('lodash')

const { detailsLabels, valueLabels, requirementsLabels } = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')
const {
  transformInvestmentForView,
  transformInvestmentValueForView,
  transformInvestmentRequirementsForView,
} = require('../transformers')

function detailsGetHandler(req, res, next) {
  if (get(res, 'locals.investment')) {
    const transformedDetails = transformInvestmentForView(res.locals.investment)
    const transformedValue = transformInvestmentValueForView(
      res.locals.investment
    )
    const transformedRequirements = transformInvestmentRequirementsForView(
      res.locals.investment
    )

    // When getting requirements, strip out empty or null rows
    // Then if there are no requirements, or the only one is the uk company,
    // set a flag so the user is told to add requirements, otherwise just show them and the edit button
    const requirements = pickBy(
      getDataLabels(transformedRequirements, requirementsLabels.view),
      isNotEmpty
    )
    const requirementKeyCount = keys(requirements).length
    let isRequirementsStarted = false

    if (
      requirementKeyCount > 1 ||
      (requirementKeyCount === 1 &&
        !has(requirements, requirementsLabels.view.uk_company))
    ) {
      isRequirementsStarted = true
    }

    return res.render('investments/views/details', {
      requirements,
      isRequirementsStarted,
      details: getDataLabels(transformedDetails, detailsLabels.view),
      values: getDataLabels(transformedValue, valueLabels.view),
    })
  }
  return next()
}

module.exports = {
  detailsGetHandler,
}
