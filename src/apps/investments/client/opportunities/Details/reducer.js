import {
  INVESTMENT_OPPORTUNITY_DETAILS__LOADED,
  INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__EDIT_DETAILS,
  INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS,
  INVESTMENT_OPPORTUNITY__CANCEL_EDIT,
  INVESTMENT_OPPORTUNITY__DETAILS_CHANGE,
  INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE,
} from '../../../../../client/actions'

const initialState = {
  incompleteDetailsFields: 0,
  incompleteRequirementsFields: 0,
  opportunity: {
    isEditingDetails: false,
    isEditingRequirements: false,
    detailsFields: {
      name: '',
      description: '',
      ukRegions: [],
      promoters: [],
      requiredChecksConducted: [],
      requiredChecksConductedOn: 0,
      requiredChecksConductedBy: {},
      leadRelationshipManager: {},
      otherDitContacts: [],
      assetClasses: [],
      valueType: [],
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
      returnRate: {},
      timeHorizons: [],
    },
    status: [],
  },
  metadata: {
    ukRegions: [],
    requiredChecks: [],
    classesOfInterest: [],
    constructionRisks: [],
    investmentTypes: [],
    returnRates: [],
    timeScales: [],
    valueTypes: [],
  },
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INVESTMENT_OPPORTUNITY_DETAILS__LOADED:
      return {
        ...state,
        opportunity: result,
      }
    case INVESTMENT_OPPORTUNITY__DETAILS_METADATA_LOADED:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          ukRegions: result.ukRegions,
          requiredChecksConducted: result.requiredChecksConducted,
          classesOfInterest: result.classesOfInterest,
          constructionRisks: result.constructionRisks,
          valueTypes: result.valueTypes,
        },
      }
    case INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED:
      return {
        ...state,
        metadata: {
          ...state.metadata,
          investmentTypes: result.investmentTypes,
          returnRates: result.returnRates,
          timeScales: result.timeScales,
        },
      }
    case INVESTMENT_OPPORTUNITY__EDIT_DETAILS:
      return {
        ...state,
        opportunity: {
          ...state.opportunity,
          isEditingDetails: true,
          isEditingRequirements: false,
        },
      }
    case INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS:
      return {
        ...state,
        opportunity: {
          ...state.opportunity,
          isEditingDetails: false,
          isEditingRequirements: true,
        },
      }
    case INVESTMENT_OPPORTUNITY__CANCEL_EDIT:
      return {
        ...state,
        opportunity: {
          ...state.opportunity,
          isEditingDetails: false,
          isEditingRequirements: false,
        },
      }
    case INVESTMENT_OPPORTUNITY__DETAILS_CHANGE:
      return {
        ...state,
        opportunity: {
          ...state.opportunity,
          ...result,
          isEditingDetails: false,
          isEditingRequirements: false,
        },
      }
    case INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE:
      return {
        ...state,
        opportunity: {
          ...state.opportunity,
          ...result,
          isEditingDetails: false,
          isEditingRequirements: false,
        },
      }
    default:
      return state
  }
}
