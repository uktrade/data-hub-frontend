const getArrayNames = (data) => data.map((d) => d.name)
const getArrayNamesAndIds = (data) =>
  data.map((d) => ({ name: d.name, id: d.id }))

const transformInvestmentOpportunity = ({
  incomplete_details_fields,
  incomplete_requirements_fields,
  name,
  description,
  uk_region_locations,
  promoters,
  required_checks_conducted,
  lead_dit_relationship_manager,
  asset_classes,
  opportunity_value_type,
  opportunity_value,
  construction_risks,
  total_investment_sought,
  current_investment_secured,
  investment_types,
  estimated_return_rate,
  time_horizons,
}) => ({
  incompleteDetailsFields: incomplete_details_fields.length,
  incompleteRequirementsFields: incomplete_requirements_fields.length,
  isEditingDetails: false,
  isEditingRequirements: false,
  detailsFields: {
    name,
    description,
    ukRegions: getArrayNames(uk_region_locations),
    promoters: getArrayNamesAndIds(promoters),
    requiredChecks: required_checks_conducted?.name,
    leadRelationshipManager: lead_dit_relationship_manager?.name,
    assetClasses: getArrayNames(asset_classes),
    opportunityValue: {
      label: opportunity_value_type?.name || 'Opportunity value',
      value: opportunity_value,
    },
    constructionRisks: getArrayNames(construction_risks),
  },
  requirementsFields: {
    totalInvestmentSought: total_investment_sought,
    currentInvestmentSecured: current_investment_secured,
    investmentTypes: getArrayNames(investment_types),
    returnRate: estimated_return_rate?.name,
    timeHorizons: getArrayNames(time_horizons),
  },
})

export default transformInvestmentOpportunity
