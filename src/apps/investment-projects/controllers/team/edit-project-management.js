const { isEmpty } = require('lodash')

const { briefInvestmentSummaryLabels } = require('../../labels')
const { getDataLabels } = require('../../../../lib/controller-utils')

function getHandler (req, res, next) {
  const briefInvestmentSummary = getDataLabels(res.locals.briefInvestmentSummaryData, briefInvestmentSummaryLabels.view)

  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Project management')
    .render('investment-projects/views/team/edit-project-management', {
      currentNavItem: 'team',
      variant: 'edit',
      briefInvestmentSummary,
    })
}

function postHandler (req, res, next) {
  if (!isEmpty(res.locals.form.errors)) {
    return next()
  }
  req.flash('success', 'Updated investment details')
  return res.redirect(`/investment-projects/${res.locals.investmentData.id}/team`)
}

module.exports = {
  getHandler,
  postHandler,
}
