import {
  ACTIVITY_TYPE_OPTIONS,
  BUSINESS_INTELLIGENCE_OPTION,
  LABELS,
} from '../../../components/ActivityFeed/CollectionList/constants'

import {
  buildOptionsFilter,
  buildDatesFilter,
  buildInputFieldFilter,
} from '../../../filters'
import { INCLUDE_RELATED_COMPANIES } from '../../../components/RoutedRelatedCompaniesCheckboxGroup/constants'

export const buildSelectedFilters = (
  queryParams,
  selectedAdvisers,
  currentAdviserId
) => ({
  advisers: {
    queryParam: 'dit_participants__adviser',
    options: selectedAdvisers.map((adviser) => ({
      label: adviser.name,
      value: adviser.id,
      categoryLabel: LABELS.advisers,
    })),
  },
  createdByOthers: {
    queryParam: 'createdByOthers',
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
  subject: {
    queryParam: 'subject',
    options: buildInputFieldFilter({
      value: queryParams.subject,
      categoryLabel: LABELS.subject,
    }),
  },
  datesAfter: {
    queryParam: 'date_after',
    options: buildDatesFilter({
      value: queryParams.date_after,
      categoryLabel: LABELS.dateAfter,
    }),
  },
  datesBefore: {
    queryParam: 'date_before',
    options: buildDatesFilter({
      value: queryParams.date_before,
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
  includeRelatedCompanies: {
    queryParam: 'include_related_companies',
    options: buildOptionsFilter({
      options: INCLUDE_RELATED_COMPANIES,
      value: queryParams.include_related_companies,
      categoryLabel: LABELS.includeRelatedCompanies,
    }),
  },
})
