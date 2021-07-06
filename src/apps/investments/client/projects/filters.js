import {
  buildOptionsFilter,
  buildDatesFilter,
} from '../../../../client/filters'

import {
  LABELS,
  PROJECT_STATUS_OPTIONS,
  INVOLVEMENT_LEVEL_OPTIONS,
} from './constants'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedAdvisers
) => ({
  stages: {
    queryParam: 'stage',
    options: buildOptionsFilter({
      options: metadata.projectStageOptions,
      value: queryParams.stage,
      categoryLabel: LABELS.stage,
    }),
  },
  advisers: {
    queryParam: 'adviser',
    options: selectedAdvisers.map(({ advisers }) => ({
      label: advisers.name,
      value: advisers.id,
      categoryLabel: LABELS.adviser,
    })),
  },
  sectors: {
    queryParam: 'sector_descends',
    options: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: queryParams.sector_descends,
      categoryLabel: LABELS.sector,
    }),
  },
  countries: {
    queryParam: 'country_investment_originates_from',
    options: buildOptionsFilter({
      options: metadata.countryOptions,
      value: queryParams.country_investment_originates_from,
      categoryLabel: LABELS.country,
    }),
  },
  ukRegions: {
    queryParam: 'uk_region_location',
    options: buildOptionsFilter({
      options: metadata.ukRegionOptions,
      value: queryParams.uk_region_location,
      categoryLabel: LABELS.ukRegion,
    }),
  },
  statuses: {
    queryParam: 'status',
    options: buildOptionsFilter({
      options: PROJECT_STATUS_OPTIONS,
      value: queryParams.status,
      categoryLabel: LABELS.projectStatus,
    }),
  },
  investmentTypes: {
    queryParam: 'investment_type',
    options: buildOptionsFilter({
      options: metadata.investmentTypeOptions,
      value: queryParams.investment_type,
      categoryLabel: LABELS.investmentType,
    }),
  },
  likelihoodToLand: {
    queryParam: 'likelihood_to_land',
    options: buildOptionsFilter({
      options: metadata.likelihoodToLandOptions,
      value: queryParams.likelihood_to_land,
      categoryLabel: LABELS.likelihoodToLand,
    }),
  },
  estimatedLandDatesBefore: {
    queryParam: 'estimated_land_date_before',
    options: buildDatesFilter({
      value: queryParams.estimated_land_date_before,
      categoryLabel: LABELS.estimatedLandDateBefore,
    }),
  },
  estimatedLandDatesAfter: {
    queryParam: 'estimated_land_date_after',
    options: buildDatesFilter({
      value: queryParams.estimated_land_date_after,
      categoryLabel: LABELS.estimatedLandDateAfter,
    }),
  },
  actualLandDatesBefore: {
    queryParam: 'actual_land_date_before',
    options: buildDatesFilter({
      value: queryParams.actual_land_date_before,
      categoryLabel: LABELS.actualLandDateBefore,
    }),
  },
  actualLandDatesAfter: {
    queryParam: 'actual_land_date_after',
    options: buildDatesFilter({
      value: queryParams.actual_land_date_after,
      categoryLabel: LABELS.actualLandDateAfter,
    }),
  },
  involvementLevels: {
    queryParam: 'level_of_involvement_simplified',
    options: buildOptionsFilter({
      options: INVOLVEMENT_LEVEL_OPTIONS,
      value: queryParams.level_of_involvement_simplified,
      categoryLabel: LABELS.involvementLevel,
    }),
  },
})
