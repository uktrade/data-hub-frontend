import {
  INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
  INVESTMENTS__OPPORTUNITIES_LOADED,
  INVESTMENTS__OPPORTUNITIES_SELECT_PAGE,
} from '../../../../client/actions'
import {
  transformInvestmentOpportunityDetails,
  transformInvestmentOpportunitiesList,
} from '../../transformers/opportunities'

const initialState = {
  page: 1,
  results: [],
  isComplete: false,
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

export default (state = initialState, { type, page, result }) => {
  switch (type) {
    case INVESTMENT_OPPORTUNITY_DETAILS__LOADED:
      return {
        ...state,
        details: transformInvestmentOpportunityDetails(result),
      }
    case INVESTMENTS__OPPORTUNITIES_LOADED:
      return {
        ...state,
        count: result.count,
        results: result?.results?.map(transformInvestmentOpportunitiesList),
        isComplete: true,
      }
    // TODO: Remove this after the feature flag capital-investments-filters
    // is removed
    case INVESTMENTS__OPPORTUNITIES_SELECT_PAGE:
      return {
        ...state,
        page,
      }
    default:
      return state
  }
}
