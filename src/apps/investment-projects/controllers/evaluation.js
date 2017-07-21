const { get } = require('lodash')

const {
  evaluationValueLabels,
  evaluationFdiLabels,
  evaluationLandingLabels,
} = require('../labels')
const { getDataLabels } = require('../../../lib/controller-utils')
const {
  transformInvestmentValueForView,
  transformInvestmentFDIForView,
  transformInvestmentLandingForView,
} = require('../services/formatting')

function renderEvaluationPage (req, res, next) {
  const transformedValue = transformInvestmentValueForView(res.locals.investmentData)
  const transformedFDI = transformInvestmentFDIForView(res.locals.investmentData)
  const transformedLanding = transformInvestmentLandingForView(res.locals.investmentData)

  if (get(res, 'locals.investmentData')) {
    return res
      .breadcrumb.add('Evaluation')
      .render('investment-projects/views/evaluation', {
        value: getDataLabels(transformedValue, evaluationValueLabels.view),
        fdi: getDataLabels(Object.assign({}, transformedValue, transformedFDI), evaluationFdiLabels.view),
        landing: getDataLabels(transformedLanding, evaluationLandingLabels.view),
        currentNavItem: 'evaluation',
      })
  }

  return next()
}

module.exports = {
  renderEvaluationPage,
}
