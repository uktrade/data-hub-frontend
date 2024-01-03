import { INCLUDE_RELATED_COMPANIES } from '../../../components/RoutedRelatedCompaniesCheckboxGroup/constants'
import { buildOptionsFilter, buildDatesFilter } from '../../../filters'

import {
  LABELS,
  PROJECT_STATUS_OPTIONS,
  INVOLVEMENT_LEVEL_OPTIONS,
} from './constants'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  selectedAdvisers,
  financialYearOptions
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
    options: selectedAdvisers.map((adviser) => ({
      label: adviser.name,
      value: adviser.id,
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
      shortDate: true,
    }),
  },
  estimatedLandDatesAfter: {
    queryParam: 'estimated_land_date_after',
    options: buildDatesFilter({
      value: queryParams.estimated_land_date_after,
      categoryLabel: LABELS.estimatedLandDateAfter,
      shortDate: true,
    }),
  },
  actualLandDatesBefore: {
    queryParam: 'actual_land_date_before',
    options: buildDatesFilter({
      value: queryParams.actual_land_date_before,
      categoryLabel: LABELS.actualLandDateBefore,
      shortDate: true,
    }),
  },
  actualLandDatesAfter: {
    queryParam: 'actual_land_date_after',
    options: buildDatesFilter({
      value: queryParams.actual_land_date_after,
      categoryLabel: LABELS.actualLandDateAfter,
      shortDate: true,
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
  financialYears: {
    queryParam: 'land_date_financial_year_start',
    options: buildOptionsFilter({
      options: financialYearOptions,
      value: queryParams.land_date_financial_year_start,
      categoryLabel: LABELS.landDate,
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
