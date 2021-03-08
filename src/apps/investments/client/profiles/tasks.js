import { apiProxyAxios } from '../../../../client/components/Task/utils'

export function getLargeCapitalProfiles({
  limit = 10,
  page,
  countryOfOrigin,
  assetClassesOfInterest,
  investorCompanyName,
  investorTypes,
  requiredChecksConducted,
  dealTicketSize,
  investmentTypes,
  minimumReturnRate,
  timeHorizon,
  restrictions,
  constructionRisk,
  minimumEquityPercentage,
  desiredDealRole,
}) {
  let offset = limit * (parseInt(page, 10) - 1) || 0
  return apiProxyAxios
    .post('/v4/search/large-investor-profile', {
      limit,
      offset,
      country_of_origin: countryOfOrigin,
      investor_type: investorTypes,
      asset_classes_of_interest: assetClassesOfInterest,
      required_checks_conducted: requiredChecksConducted,
      deal_ticket_size: dealTicketSize,
      investment_type: investmentTypes,
      minimum_return_rate: minimumReturnRate,
      time_horizon: timeHorizon,
      restriction: restrictions,
      construction_risk: constructionRisk,
      minimum_equity_percentage: minimumEquityPercentage,
      desired_deal_role: desiredDealRole,
      ...(investorCompanyName
        ? { investor_company_name: investorCompanyName }
        : {}),
    })
    .then(({ data }) => {
      return data
    })
}

const idName2valueLabel = ({ id, name }) => ({ value: id, label: name })

const mapOptionsWithCategory = (options, category) =>
  options.map((option) =>
    Object.assign(idName2valueLabel(option), { categoryLabel: category })
  )

export const loadFilterOptions = () =>
  Promise.all([
    apiProxyAxios.get('/v4/metadata/country'),
    apiProxyAxios.get('/v4/metadata/capital-investment/asset-class-interest'),
    apiProxyAxios.get('/v4/metadata/capital-investment/investor-type'),
    apiProxyAxios.get(
      '/v4/metadata/capital-investment/required-checks-conducted'
    ),
    apiProxyAxios.get('/v4/metadata/capital-investment/deal-ticket-size'),
    apiProxyAxios.get(
      'v4/metadata/capital-investment/large-capital-investment-type'
    ),
    apiProxyAxios.get('/v4/metadata/capital-investment/return-rate'),
    apiProxyAxios.get('/v4/metadata/capital-investment/time-horizon'),
    apiProxyAxios.get('/v4/metadata/capital-investment/restriction'),
    apiProxyAxios.get('/v4/metadata/capital-investment/construction-risk'),
    apiProxyAxios.get('/v4/metadata/capital-investment/equity-percentage'),
    apiProxyAxios.get('/v4/metadata/capital-investment/desired-deal-role'),
  ]).then(
    ([
      { data: countries },
      { data: classes },
      { data: investorTypes },
      { data: requiredChecksConducted },
      { data: ticketSizes },
      { data: investmentTypes },
      { data: returnRates },
      { data: timeHorizons },
      { data: restrictions },
      { data: constructionRisks },
      { data: equityPercentages },
      { data: dealRoles },
    ]) => ({
      countries: countries.map(idName2valueLabel),
      assetClassesOfInterest: classes.map(idName2valueLabel),
      investorTypes: investorTypes.map(idName2valueLabel),
      requiredChecksConducted: requiredChecksConducted.map(idName2valueLabel),
      dealTicketSize: ticketSizes.map(idName2valueLabel),
      investmentTypes: investmentTypes.map(idName2valueLabel),
      minimumReturnRate: mapOptionsWithCategory(returnRates, 'Min Return Rate'),
      timeHorizon: timeHorizons.map(idName2valueLabel),
      restrictions: restrictions.map(idName2valueLabel),
      constructionRisk: constructionRisks.map(idName2valueLabel),
      minimumEquityPercentage: mapOptionsWithCategory(
        equityPercentages,
        'Min Equity %'
      ),
      desiredDealRole: dealRoles.map(idName2valueLabel),
    })
  )
