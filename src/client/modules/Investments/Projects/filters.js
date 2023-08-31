import { buildInputFieldFilter, buildOptionsFilter } from '../../../filters'
import {
  LABELS,
  PROJECT_STATUS_OPTIONS,
} from '../../../../apps/investments/client/projects/constants'

export const buildSelectedFilters = (
  queryParams,
  metadata,
  financialYearOptions
) => ({
  name: {
    queryParam: 'name',
    options: buildInputFieldFilter({
      value: queryParams.name,
      categoryLabel: LABELS.name,
    }),
  },
  projectCode: {
    queryParam: 'project_code',
    options: buildInputFieldFilter({
      value: queryParams.project_code,
      categoryLabel: LABELS.projectCode,
    }),
  },
  stages: {
    queryParam: 'stage',
    options: buildOptionsFilter({
      options: metadata.projectStageOptions,
      value: queryParams.stage,
      categoryLabel: LABELS.stage,
    }),
  },
  sectors: {
    queryParam: 'sector_descends',
    options: buildOptionsFilter({
      options: metadata.sectorOptions,
      value: queryParams.sector_descends,
      categoryLabel: LABELS.sector,
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
  financialYears: {
    queryParam: 'land_date_financial_year_start',
    options: buildOptionsFilter({
      options: financialYearOptions,
      value: queryParams.land_date_financial_year_start,
      categoryLabel: LABELS.landDate,
    }),
  },
})
