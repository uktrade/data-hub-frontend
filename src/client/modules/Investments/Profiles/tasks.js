import urls from '../../../../lib/urls'
import { apiProxyAxios } from '../../../components/Task/utils'
import { getMetadataOptions } from '../../../metadata'

import transformLargeCapitalProfiles from './transformers'

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
  investableCapital,
  globalAssetsUnderManagement,
  ukRegionsOfInterest,
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
      uk_region_location: ukRegionsOfInterest,
      ...(investorCompanyName
        ? { investor_company_name: investorCompanyName }
        : {}),
      ...(globalAssetsUnderManagement.min
        ? {
            global_assets_under_management_start:
              globalAssetsUnderManagement.min,
          }
        : {}),
      ...(globalAssetsUnderManagement.max
        ? {
            global_assets_under_management_end: globalAssetsUnderManagement.max,
          }
        : {}),
      ...(investableCapital.min
        ? { investable_capital_start: investableCapital.min }
        : {}),
      ...(investableCapital.max
        ? { investable_capital_end: investableCapital.max }
        : {}),
    })
    .then(({ data }) => ({
      count: data.count,
      results: data.results.map(transformLargeCapitalProfiles),
    }))
}

export const loadFilterOptions = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.capitalInvestmentAssetClassInterest()),
    getMetadataOptions(urls.metadata.capitalInvestmentInvestorType()),
    getMetadataOptions(
      urls.metadata.capitalInvestmentRequiredChecksConducted()
    ),
    getMetadataOptions(urls.metadata.capitalInvestmentDealTicketSize()),
    getMetadataOptions(
      urls.metadata.capitalInvestmentLargeCapitalInvestmentType()
    ),
    getMetadataOptions(urls.metadata.capitalInvestmentReturnRate()),
    getMetadataOptions(urls.metadata.capitalInvestmentTimeHorizon()),
    getMetadataOptions(urls.metadata.capitalInvestmentRestriction()),
    getMetadataOptions(urls.metadata.capitalInvestmentConstructionRisk()),
    getMetadataOptions(urls.metadata.capitalInvestmentEquityPercentage()),
    getMetadataOptions(urls.metadata.capitalInvestmentDesiredDealRole()),
    getMetadataOptions(urls.metadata.ukRegion(), { filterDisabled: false }),
  ]).then(
    ([
      countries,
      assetClassesOfInterest,
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
      ukRegionsOfInterest,
    ]) => ({
      countries,
      assetClassesOfInterest,
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
      ukRegionsOfInterest,
    })
  )
