const renderInvestmentsGrowthCapitalProfile = (req, res, next) => {
  const { company, features } = res.locals

  const newView = 'companies/views/investments/growth-capital-profile'
  const deprecatedView = 'companies/views/_deprecated/investments/growth-capital-profile'
  const view = company.duns_number || features['companies-new-layout'] ? newView : deprecatedView

  res.render(view)
}

module.exports = {
  renderInvestmentsGrowthCapitalProfile,
}
