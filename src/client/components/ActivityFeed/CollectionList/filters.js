import {
  ACTIVITY_TYPE_OPTIONS,
  BUSINESS_INTELLIGENCE_OPTION,
  LABELS,
  SHOW_DNB_HIERARCHY_OPTIONS,
} from './constants'

import {
  buildOptionsFilter,
  buildDatesFilter,
  buildInputFieldFilter,
} from '../../../filters'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedAdvisers,
  selectedTeams,
  selectedCompanies
) => ({
  showDNBHierarchy: {
    queryParam: 'showDnbHierarchy',
    options: buildOptionsFilter({
      options: SHOW_DNB_HIERARCHY_OPTIONS,
      value: queryParams.showDNBHierarchy,
      categoryLabel: LABELS.showDNBHierarchy,
    }),
  },
  advisers: {
    queryParam: 'ditParticipantsAdviser',
    options: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: LABELS.advisers,
    })),
  },
  company: {
    queryParam: 'company',
    options: selectedCompanies.map(({ companies }) => ({
      label: companies.name,
      value: companies.id,
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
