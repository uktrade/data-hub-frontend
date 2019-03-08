const list = 'companies/apps/investments/growth-capital-profile/views/list'

const renderGrowthCapitalProfile = (req, res, next) => {
  const { company, features } = res.locals

  const view = (company.duns_number || features['companies-new-layout']) ? list : `${list}-deprecated`

  res.render(view)
}

module.exports = renderGrowthCapitalProfile
