const { get, isEmpty } = require('lodash')

const { briefInvestmentSummaryLabels } = require('../../labels')
const { getDataLabels } = require('../../../../lib/controller-utils')

function getHandler(req, res) {
  const briefInvestmentSummary = getDataLabels(
    res.locals.briefInvestmentSummaryData,
    briefInvestmentSummaryLabels.view
  )

  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Project management')
    .render('investments/views/team/edit-project-management', {
      briefInvestmentSummary,
    })
}

function postHandler(req, res, next) {
  const returnUrl = get(req.body, 'returnUrl')

  if (!isEmpty(get(res.locals, 'form.errors'))) {
    return next()
  }

  req.flash('success', 'Investment details updated')
  if (returnUrl) {
    return res.redirect(returnUrl)
  }

  const { projects } = res.locals.paths
  const { id } = res.locals.investment
  return res.redirect(`${projects}/${id}/team`)
}

function editProjectManagementHandler(req, res) {
  const {
    id,
    project_assurance_adviser,
    project_manager,
    sector,
    one_list_group_tier,
    uk_region_locations,
    competitor_countries,
    estimated_land_date,
    total_investment,
    investor_company,
  } = res.locals.investment
  res.render('investments/views/team/edit-project-management', {
    props: {
      id,
      projectAssuranceAdviser: project_assurance_adviser,
      projectManager: project_manager,
      primarySector: sector,
      clientCompany: investor_company,
      accountTier: one_list_group_tier,
      possibleUKLocations: uk_region_locations,
      competitorCountries: competitor_countries,
      estimatedLandDate: estimated_land_date,
      totalInvestment: total_investment,
    },
  })
}

module.exports = {
  getHandler,
  postHandler,
  editProjectManagementHandler,
}
