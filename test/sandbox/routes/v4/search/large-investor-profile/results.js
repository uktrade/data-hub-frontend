var largeCapitalProfile = require('./../../../../fixtures/v4/investment/large-capital-profile-list10.json')

exports.largeInvestorProfile = function (req, res) {
  const countryOfOriginFilter = req.body.country_of_origin || []
  const assetClassesOfInterestFilter = req.body.asset_classes_of_interest || []
  const investorCompanyNameFilter = req.body.investor_company_name
  const investorTypesFilter = req.body.investor_type || []
  const requiredChecksConductedFilter = req.body.required_checks_conducted || []
  const dealTicketSizeFilter = req.body.deal_ticket_size || []
  const investmentTypesFilter = req.body.investment_type || []
  const minimumReturnRateFilter = req.body.minimum_return_rate || []
  const timeHorizonFilter = req.body.time_horizon || []
  const restrictionsFilter = req.body.restriction || []
  const constructionRiskFilter = req.body.construction_risk || []
  const minimumEquityPercentageFilter = req.body.minimum_equity_percentage || []
  const desiredDealRoleFilter = req.body.desired_deal_role || []

  const filtered = largeCapitalProfile.results
    .filter(({ country_of_origin }) =>
      countryOfOriginFilter.length
        ? countryOfOriginFilter.includes(country_of_origin)
        : true
    )
    .filter(({ asset_classes_of_interest = [] }) =>
      assetClassesOfInterestFilter.length
        ? _.intersection(
            assetClassesOfInterestFilter,
            asset_classes_of_interest.map((x) => x.id)
          ).length
        : true
    )
    .filter(({ investor_company: { name = '' } }) =>
      investorCompanyNameFilter
        ? name
            .toLowerCase()
            .includes(req.body.investor_company_name.toLowerCase())
        : true
    )
    .filter(({ investor_type }) =>
      investorTypesFilter.length
        ? investor_type && investorTypesFilter.includes(investor_type.id)
        : true
    )
    .filter(({ required_checks_conducted }) =>
      requiredChecksConductedFilter.length
        ? required_checks_conducted &&
          requiredChecksConductedFilter.includes(required_checks_conducted.id)
        : true
    )
    .filter(({ deal_ticket_sizes = [] }) =>
      dealTicketSizeFilter.length
        ? _.intersection(
            dealTicketSizeFilter,
            deal_ticket_sizes.map((x) => x.id)
          ).length
        : true
    )
    .filter(({ investment_types = [] }) =>
      investmentTypesFilter.length
        ? _.intersection(
            investmentTypesFilter,
            investment_types.map((x) => x.id)
          ).length
        : true
    )
    .filter(({ minimum_return_rate }) =>
      minimumReturnRateFilter.length
        ? minimum_return_rate &&
          minimumReturnRateFilter.includes(minimum_return_rate.id)
        : true
    )
    .filter(({ time_horizons = [] }) =>
      timeHorizonFilter.length
        ? _.intersection(
            timeHorizonFilter,
            time_horizons.map((x) => x.id)
          ).length
        : true
    )
    .filter(({ restrictions = [] }) =>
      restrictionsFilter.length
        ? _.intersection(
            restrictionsFilter,
            restrictions.map((x) => x.id)
          ).length
        : true
    )
    .filter(({ construction_risks = [] }) =>
      constructionRiskFilter.length
        ? _.intersection(
            constructionRiskFilter,
            construction_risks.map((x) => x.id)
          ).length
        : true
    )
    .filter(({ minimum_equity_percentage }) =>
      minimumEquityPercentageFilter.length
        ? minimum_equity_percentage &&
          minimumEquityPercentageFilter.includes(minimum_equity_percentage.id)
        : true
    )
    .filter(({ desired_deal_roles = [] }) =>
      desiredDealRoleFilter.length
        ? _.intersection(
            desiredDealRoleFilter,
            desired_deal_roles.map((x) => x.id)
          ).length
        : true
    )

  res.json({
    count: filtered.length,
    results: filtered,
  })
}
