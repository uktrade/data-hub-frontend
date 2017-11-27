const { get, isEmpty } = require('lodash')

const { briefInvestmentSummaryLabels } = require('../../labels')
const { getDataLabels } = require('../../../../lib/controller-utils')

function getHandler (req, res, next) {
  const briefInvestmentSummary = getDataLabels(res.locals.briefInvestmentSummaryData, briefInvestmentSummaryLabels.view)

  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Project management')
    .render('investment-projects/views/team/edit-project-management', {
      briefInvestmentSummary,
    })
}

function postHandler (req, res, next) {
  const returnUrl = get(req.body, 'returnUrl')

  if (!isEmpty(get(res.locals, 'form.errors'))) {
    return next()
  }

  req.flash('success', 'Investment details updated')
  if (returnUrl) {
    return res.redirect(returnUrl)
  }
  return res.redirect(`/investment-projects/${res.locals.investmentData.id}/team`)
}

module.exports = {
  getHandler,
  postHandler,
}
