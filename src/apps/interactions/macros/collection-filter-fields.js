/* eslint camelcase: 0 */
const { assign, flatten, get } = require('lodash')

const labels = require('../labels')
const { provider } = require('./fields')

const currentYear = (new Date()).getFullYear()

function getAdviserOptions (currentAdviserId, adviserFacets) {
  let myCount = 0

  const adviserOptions = (adviserFacets || []).filter((item) => {
    if (item.value === currentAdviserId) {
      myCount = item.count
      return false
    }

    return true
  })

  if (adviserOptions.length === 0) {
    adviserOptions.push({
      value: currentAdviserId,
      label: 'My interactions',
    })
  } else if (myCount > 0) {
    adviserOptions.unshift({
      value: currentAdviserId,
      label: 'My interactions',
      count: myCount,
    })
  }

  return adviserOptions
}

module.exports = function ({ currentAdviserId, dit_team, dit_adviser } = {}) {
  const adviserOptions = getAdviserOptions(currentAdviserId, dit_adviser)

  return [
    {
      macroName: 'MultipleChoiceField',
      name: 'dit_adviser',
      type: 'checkbox',
      modifier: 'option-select',
      options: adviserOptions,
    },
    {
      macroName: 'TextField',
      name: 'date_after',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-18`,
    },
    {
      macroName: 'TextField',
      name: 'date_before',
      hint: 'YYYY-MM-DD',
      placeholder: `e.g. ${currentYear}-07-21`,
    },
    assign({}, provider(dit_team), {
      type: 'checkbox',
      modifier: 'option-select',
    }),
  ]
    .filter(filter => {
      if (filter.name !== 'dit_adviser' && filter.macroName === 'MultipleChoiceField' && get(filter, 'options', []).length < 2) {
        return false
      }
      return true
    })
    .map(filter => {
      return assign(filter, {
        label: labels.filters[filter.name],
        modifier: flatten([filter.modifier, 'smaller', 'light', 'filter']),
      })
    })
}
