import {
  ACTIVITY_TYPE_OPTIONS,
  BUSINESS_INTELLIGENCE_OPTION,
  LABELS,
} from './constants'

import {
  buildOptionsFilter,
  buildDatesFilter,
  buildInputFieldFilter,
} from '../../../filters'

export const buildSelectedFilters = (
  queryParams,
  selectedAdvisers,
  selectedCompanies,
  currentAdviserId
) => ({
  showDNBHierarchy: {
    queryParam: 'showDnbHierarchy',
    options: buildOptionsFilter({
      value: queryParams.showDNBHierarchy,
      categoryLabel: LABELS.showDNBHierarchy,
    }),
  },
  advisers: {
    queryParam: 'ditParticipantsAdviser',
    options: selectedAdvisers.map((adviser) => ({
      label: adviser.name,
      value: adviser.id,
      categoryLabel: LABELS.advisers,
    })),
  },
  createdByOthers: {
    queryParams: 'createdByOthers',
    options: buildOptionsFilter({
      options: [
        {
          label: LABELS.others,
          value: currentAdviserId,
        },
      ],
      value: queryParams.createdByOthers,
      categoryLabel: LABELS.createdBy,
    }),
  },
  company: {
    queryParam: 'company',
    options: selectedCompanies.map((company) => ({
      label: company.name,
      value: company.id,
      categoryLabel: LABELS.company,
    })),
  },
  subject: {
    queryParam: 'subject',
    options: buildInputFieldFilter({
      value: queryParams.subject,
      categoryLabel: LABELS.subject,
    }),
  },
  datesAfter: {
    queryParam: 'dateAfter',
    options: buildDatesFilter({
      value: queryParams.dateAfter,
      categoryLabel: LABELS.dateAfter,
    }),
  },
  datesBefore: {
    queryParam: 'dateBefore',
    options: buildDatesFilter({
      value: queryParams.dateBefore,
      categoryLabel: LABELS.dateBefore,
    }),
  },
  activityType: {
    queryParam: 'activityTypeFilter',
    options: buildOptionsFilter({
      options: ACTIVITY_TYPE_OPTIONS,
      value: queryParams.activityType,
      categoryLabel: LABELS.activityType,
    }),
  },
  businessIntelligence: {
    queryParam: 'was_policy_feedback_provided',
    options: buildOptionsFilter({
      options: BUSINESS_INTELLIGENCE_OPTION,
      value: queryParams.was_policy_feedback_provided,
      categoryLabel: LABELS.businessIntelligence,
    }),
  },
})
