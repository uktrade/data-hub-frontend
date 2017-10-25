const { filter, map } = require('lodash')
const { sentence } = require('case')

const metadataRepository = require('../../lib/metadata')
const ukOtherBusinessTypeNames = [
  'Charity',
  'Government Dept',
  'Intermediary',
  'Limited partnership',
  'Partnership',
  'Sole Trader',
]
const foreignOtherBusinessTypeNames = [
  'Company',
  ...ukOtherBusinessTypeNames,
]

/**
 * extract businessOptions from metadata by name and build an options list with
 * @param requestedProperties
 * @param metaDataOptions
 * @returns {{label: String, id: String}[]}
 */
const buildBusinessTypeOptions = (requestedProperties, metaDataOptions) => {
  return map(filter(metaDataOptions, (option) => {
    return requestedProperties.indexOf(option.name) >= 0
  }), (option) => {
    return {
      value: option.id,
      label: sentence(option.name.replace('Dept', 'department'), []),
    }
  })
}

const buildUkOtherCompanyOptions = () => {
  return buildBusinessTypeOptions(ukOtherBusinessTypeNames, metadataRepository.businessTypeOptions)
}

const buildForeignOtherCompanyOptions = () => {
  return buildBusinessTypeOptions(foreignOtherBusinessTypeNames, metadataRepository.businessTypeOptions)
}

module.exports = {
  buildUkOtherCompanyOptions,
  buildForeignOtherCompanyOptions,
}
