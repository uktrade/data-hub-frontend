import urls from '../../../../lib/urls'
import { idNamesToValueLabels } from '../../../utils'
import { apiProxyAxios } from '../../../components/Task/utils'
import { transformValueForAPI } from '../../../utils/date'
import { getMetadataOptions } from '../../../metadata'

import { transformInvestmentOpportunityDetails } from './transformers'

export const getOpportunityDetails = ({ opportunityId }) =>
  getMetadataOptions(
    urls.metadata.largeCapitalOpportunityDetails(opportunityId)
  ).then(({ data }) => transformInvestmentOpportunityDetails(data))

export const getDetailsMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.largeCapitalOpportunityMetadata()),
  ]).then(([{ data: valueTypes }]) => ({
    valueTypes: idNamesToValueLabels(valueTypes),
  }))

export const getRequirementsMetadata = () =>
  Promise.all([
    getMetadataOptions(
      urls.metadata.capitalInvestmentLargeCapitalInvestmentType()
    ),
    getMetadataOptions.get(urls.metadata.capitalInvestmentReturnRate()),
    getMetadataOptions.get(urls.metadata.capitalInvestmentTimeHorizon()),
  ]).then(
    ([
      { data: investmentTypes },
      { data: returnRates },
      { data: timeScales },
    ]) => ({
      investmentTypes: idNamesToValueLabels(investmentTypes),
      returnRates: idNamesToValueLabels(returnRates),
      timeScales: idNamesToValueLabels(timeScales),
    })
  )

export function saveOpportunityDetails({ values, opportunityId }) {
  return apiProxyAxios
    .patch(`v4/large-capital-opportunity/${opportunityId}`, {
      name: values.name,
      description: values.description,
      uk_region_locations: values.ukRegions?.map(({ value }) => value),
      promoters: values.promoters?.map(({ value }) => value),
      required_checks_conducted: values.requiredChecksConducted
        ? values.requiredChecksConducted
        : undefined,
      required_checks_conducted_by: values.requiredChecksConductedBy?.value,
      required_checks_conducted_on: values.requiredChecksConductedOn
        ? transformValueForAPI(values.requiredChecksConductedOn)
        : undefined,
      lead_dit_relationship_manager: values.leadRelationshipManager?.value,
      other_dit_contacts: values.otherDitContacts?.map(({ value }) => value),
      asset_classes: values.assetClasses?.map(({ value }) => value),
      opportunity_value: values.opportunityValue
        ? values.opportunityValue
        : undefined,
      // TODO: refactor this to not be in an array once the API is fixed.
      construction_risks: values.constructionRisks.length
        ? [values.constructionRisks]
        : [],
      opportunity_value_type: values.valueType ? values.valueType : undefined,
    })
    .then(({ data }) => transformInvestmentOpportunityDetails(data))
}

export function saveOpportunityRequirements({ values, opportunityId }) {
  return apiProxyAxios
    .patch(`v4/large-capital-opportunity/${opportunityId}`, {
      total_investment_sought: values.total_investment_sought,
      current_investment_secured: values.current_investment_secured,
      investment_types: values.investment_types,
      estimated_return_rate: values.estimated_return_rate,
      // TODO: Remove array bracket after refactoring endpoint.
      time_horizons: values.time_horizons ? [values.time_horizons] : [],
    })
    .then(({ data }) => transformInvestmentOpportunityDetails(data))
}

export function createOpportunity(name) {
  return apiProxyAxios
    .post('v4/large-capital-opportunity', name)
    .then(({ data: { id } }) => id)
}

export function saveOpportunityStatus({ opportunityId, values }) {
  return apiProxyAxios.patch(`v4/large-capital-opportunity/${opportunityId}`, {
    status: values.status,
  })
}
