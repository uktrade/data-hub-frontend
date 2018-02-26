/* eslint camelcase: 0 */
const { assign, flatten, get } = require('lodash')
const { globalFields } = require('../../macros')
const { collectionFilterLabels } = require('../labels')

const currentYear = (new Date()).getFullYear()

// Most facets in event search act like others except organiser
// The filters must allow the user to select themselves if no
// organiser facet list exists
// and if a list does exist, move show the current user
// at the top unless they are not included
function getOrganiserOptions (currentAdviserId, organiserFacets) {
  let myCount = 0

  const organiserOptions = (organiserFacets || []).filter((item) => {
    if (item.value === currentAdviserId) {
      myCount = item.count
      return false
    }

    return true
  })

  if (organiserOptions.length === 0) {
    organiserOptions.push({
      value: currentAdviserId,
      label: 'My events',
    })
  } else if (myCount > 0) {
    organiserOptions.unshift({
      value: currentAdviserId,
      label: 'My events',
      count: myCount,
    })
  }

  return organiserOptions
}

const eventFiltersFields = ({
  organiser,
  event_type,
  address_country,
  uk_region,
  currentAdviserId,
} = {}) => {
  const organiserOptions = getOrganiserOptions(currentAdviserId, organiser)

  return [
    {
      macroName: 'TextField',
      name: 'name',
      label: 'Event name',
    },
    {
      macroName: 'MultipleChoiceField',
      name: 'organiser',
      label: 'Organiser',
      type: 'checkbox',
      modifier: 'option-select',
      options: organiserOptions,
    },
    {
      macroName: 'TextField',
      name: 'start_date_after',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-18`,
    },
    {
      macroName: 'TextField',
      name: 'start_date_before',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-21`,
    },
    assign({}, globalFields.eventTypes, {
      name: 'event_type',
      type: 'checkbox',
      modifier: 'option-select',
      options: event_type,
    }),
    assign({}, globalFields.countries, {
      name: 'address_country',
      type: 'checkbox',
      modifier: 'option-select',
      options: address_country,
    }),
    assign({}, globalFields.ukRegions, {
      name: 'uk_region',
      type: 'checkbox',
      modifier: 'option-select',
      options: uk_region,
    })]
    .filter(filter => {
      if (filter.name !== 'organiser' && filter.macroName === 'MultipleChoiceField' && get(filter, 'options', []).length < 2) {
        return false
      }
      return true
    })
    .map(filter => {
      return assign(filter, {
        label: collectionFilterLabels.edit[filter.name],
        modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
      })
    })
}

module.exports = eventFiltersFields
