const { formatMediumDateTime } = require('../../../../../client/utils/date')

const getNameAndId = (data) =>
  data ? { value: data.id, label: data.name } : {}

const idNameToValueLabel = ({ id, name }) => ({ value: id, label: name })

export const transformInvestmentOpportunityDetails = ({
  incomplete_details_fields,
  incomplete_requirements_fields,
  created_on,
  name,
  description,
  uk_region_locations,
  promoters,
  required_checks_conducted,
  required_checks_conducted_by,
  required_checks_conducted_on,
  lead_dit_relationship_manager,
  other_dit_contacts,
  asset_classes,
  opportunity_value_type,
  opportunity_value,
  construction_risks,
  total_investment_sought,
  current_investment_secured,
  investment_types,
  estimated_return_rate,
  time_horizons,
  status,
}) => ({
  incompleteDetailsFields: incomplete_details_fields.length,
  incompleteRequirementsFields: incomplete_requirements_fields.length,
  isEditingDetails: false,
  isEditingRequirements: false,
  status: idNameToValueLabel(status),
  detailsFields: {
    createdOn: formatMediumDateTime(created_on),
    name,
    description,
    ukRegions: uk_region_locations.map(idNameToValueLabel),
    promoters: promoters.map(idNameToValueLabel),
    requiredChecksConducted: getNameAndId(required_checks_conducted),
    requiredChecksConductedBy: getNameAndId(required_checks_conducted_by),
    requiredChecksConductedOn: required_checks_conducted_on,
    leadRelationshipManager: getNameAndId(lead_dit_relationship_manager),
    otherDitContacts: other_dit_contacts.map(idNameToValueLabel),
    assetClasses: asset_classes.map(idNameToValueLabel),
    valueType: getNameAndId(opportunity_value_type),
    opportunityValue: {
      label: opportunity_value_type?.name || 'Opportunity value',
      value: opportunity_value,
    },
    constructionRisks: construction_risks.map(idNameToValueLabel),
  },
  requirementsFields: {
    totalInvestmentSought: total_investment_sought,
    currentInvestmentSecured: current_investment_secured,
    investmentTypes: investment_types.map(idNameToValueLabel),
    returnRate: getNameAndId(estimated_return_rate),
    timeHorizons: time_horizons.map(idNameToValueLabel),
  },
})
