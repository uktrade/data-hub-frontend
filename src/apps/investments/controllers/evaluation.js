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
} = require('../transformers')

function renderEvaluationPage(req, res, next) {
  const transformedValue = transformInvestmentValueForView(
    res.locals.investment
  )
  const transformedFDI = transformInvestmentFDIForView(res.locals.investment)
  const transformedLanding = transformInvestmentLandingForView(
    res.locals.investment
  )

  if (get(res, 'locals.investment')) {
    return res.breadcrumb('Evaluation').render('investments/views/evaluation', {
      value: getDataLabels(transformedValue, evaluationValueLabels.view),
      fdi: getDataLabels(
        Object.assign({}, transformedValue, transformedFDI),
        evaluationFdiLabels.view
      ),
      landing: getDataLabels(transformedLanding, evaluationLandingLabels.view),
    })
  }

  return next()
}

module.exports = {
  renderEvaluationPage,
}
