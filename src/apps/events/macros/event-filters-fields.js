const { assign } = require('lodash')
const { globalFields } = require('../../macros')
const { collectionFilterLabels } = require('../labels')

const currentYear = (new Date()).getFullYear()

const eventFiltersFields = [
  {
    macroName: 'TextField',
    name: 'name',
    hint: 'At least three characters',
  },
  assign({}, globalFields.eventTypes, {
    name: 'event_type',
    initialOption: 'All types',
  }),
  assign({}, globalFields.countries, {
    name: 'address_country',
    initialOption: 'All countries',
  }),
  assign({}, globalFields.ukRegions, {
    name: 'uk_region',
    initialOption: 'All UK regions',
  }),
  {
    macroName: 'TextField',
    name: 'start_date',
    hint: 'YYYY-MM-DD',
    placeholder: `e.g. ${currentYear}-07-18`,
  },
  {
    macroName: 'TextField',
    name: 'end_date',
    hint: 'YYYY-MM-DD',
    placeholder: `e.g. ${currentYear}-07-21`,
  },
].map(filter => {
  return assign(filter, {
    label: collectionFilterLabels.edit[filter.name],
    modifier: ['smaller', 'light'],
  })
})

module.exports = eventFiltersFields
