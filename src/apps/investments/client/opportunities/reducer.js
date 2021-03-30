import { INVESTMENT_OPPORTUNITY_DETAILS__LOADED } from '../../../../client/actions'
import transformInvestmentOpportunity from '../../transformers/opportunities'

const initialState = {
  details: {
    incompleteDetailsFields: 0,
    incompleteRequirementsFields: 0,
    detailsFields: {
      name: '',
      description: '',
      ukRegions: [],
      promoters: [],
      requiredChecks: '',
      leadRelationshipManager: '',
      assetClasses: [],
      opportunityValue: {
        label: 'Opportunity value',
        value: 0,
      },
      constructionRisks: [],
    },
    requirementsFields: {
      totalInvestmentSought: 0,
      currentInvestmentSecured: 0,
      investmentTypes: [],
      returnRate: '',
      timeHorizons: [],
    },
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENT_OPPORTUNITY_DETAILS__LOADED:
      return {
        ...state,
        details: transformInvestmentOpportunity(result),
      }
    default:
      return state
  }
}
