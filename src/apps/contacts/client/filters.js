import {
  SECTOR,
  COUNTRY,
  UK_REGION,
  CONTACTS_NAME,
  COMPANY_NAME,
  STATUS,
} from './labels'

import { STATUS_OPTIONS } from './metadata'

const buildOptionsFilter = ({ options = [], value, categoryLabel }) =>
  options
    .filter((option) => value && value.includes(option.value))
    .map(({ value, label }) => ({
      value,
      label,
      categoryLabel,
    }))

const buildInputFieldFilter = ({ value, label, categoryLabel }) =>
  value
    ? [
        {
          value,
          label,
          categoryLabel,
        },
      ]
    : []

export const buildSelectedFilters = (
  {
    name,
    company_name,
    company_sector_descends,
    address_country,
    company_uk_region,
    archived,
  },
  {
    sectorOptions,
    countryOptions,
    ukRegionOptions,
    statusOptions = STATUS_OPTIONS,
  }
) => ({
  selectedName: buildInputFieldFilter({
    value: name,
    label: name,
    categoryLabel: CONTACTS_NAME,
  }),
  selectedCompanyName: buildInputFieldFilter({
    value: company_name,
    label: company_name,
    categoryLabel: COMPANY_NAME,
  }),
  selectedCompanySectors: buildOptionsFilter({
    options: sectorOptions,
    value: company_sector_descends,
    categoryLabel: SECTOR,
  }),
  selectedAddressCountries: buildOptionsFilter({
    options: countryOptions,
    value: address_country,
    categoryLabel: COUNTRY,
  }),
  selectedCompanyUkRegions: buildOptionsFilter({
    options: ukRegionOptions,
    value: company_uk_region,
    categoryLabel: UK_REGION,
  }),
  selectedStatus: buildOptionsFilter({
    options: statusOptions,
    value: archived,
    categoryLabel: STATUS,
  }),
})
