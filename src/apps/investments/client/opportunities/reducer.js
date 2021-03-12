import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../../client/actions'

const initialState = {
  details: {
    name: { label: '', value: '' },
    description: { label: '', value: '' },
    uk_region_locations: { label: '', value: [] },
    promoters: { label: '', value: [] },
    required_checks_conducted: { label: '', value: '' },
    lead_dit_relationship_manager: { label: '', value: '' },
    asset_classes: { label: '', value: [] },
    opportunity_value: { label: '', value: '' },
    construction_risks: { label: '', value: [] },
  },
}

// TODO: move somewhere sensible
const transformLargeCapitalOpportunities = ({
  name,
  description,
  uk_region_locations,
  promoters,
  required_checks_conducted,
  lead_dit_relationship_manager,
  asset_classes,
  opportunity_value,
  construction_risks,
}) => ({
  name: {
    label: 'Opportunity Name',
    value: name,
  },
  description: {
    label: 'Opportunity Description',
    value: description,
  },
  uk_region_locations: {
    label: 'UK Location',
    value: uk_region_locations.length ? uk_region_locations : null,
  },
  promoters: {
    label: 'Promoters',
    value: promoters.length ? promoters : null,
  },
  required_checks_conducted: {
    label: 'Has this opportunity cleared the required checks?',
    value: required_checks_conducted?.id,
  },
  lead_dit_relationship_manager: {
    label: 'Lead DIT relationship manager',
    value: lead_dit_relationship_manager?.id,
  },
  asset_classes: {
    label: 'Asset classes',
    value: asset_classes.length ? asset_classes : null,
  },
  opportunity_value: {
    label: 'Value',
    value: opportunity_value,
  },
  construction_risks: {
    label: 'Construction risk',
    value: construction_risks.length ? uk_region_locations : null,
  },
})

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENT_OPPORTUNITY_DETAILS__LOADED:
      return {
        ...state,
        details: transformLargeCapitalOpportunities(result),
      }
    default:
      return state
  }
}
