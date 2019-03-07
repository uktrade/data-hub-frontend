const renderInvestmentsLargeCapitalProfile = (req, res, next) => {
  const { company, features } = res.locals

  const newView = 'companies/views/investments/large-capital-profile'
  const deprecatedView = 'companies/views/_deprecated/investments/large-capital-profile'
  const view = company.duns_number || features['companies-new-layout'] ? newView : deprecatedView

  res.render(view)
}

module.exports = {
  renderInvestmentsLargeCapitalProfile,
}
