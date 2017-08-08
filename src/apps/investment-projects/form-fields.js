const { map, omit } = require('lodash')

function buildMacroConfig (fields, globalProps) {
  return map(fields, (field, fieldName) => {
    return {
      [field.macroName]: Object.assign({}, omit(field, 'macroName'), {
        name: fieldName,
      }, globalProps),
    }
  })
}

const filterFields = buildMacroConfig({
  stage: {
    macroName: 'MultipleChoiceField',
    type: 'checkbox',
  },
  investment_type: {
    macroName: 'MultipleChoiceField',
    type: 'checkbox',
  },
  sector: {
    macroName: 'MultipleChoiceField',
    initialOption: 'All sectors',
  },
  estimated_land_date_before: {
    macroName: 'TextField',
    hint: 'YYYY-MM-DD',
    placeholder: 'e.g. 2018-07-18',
  },
  estimated_land_date_after: {
    macroName: 'TextField',
    hint: 'YYYY-MM-DD',
    placeholder: 'e.g. 2019-05-09',
  },
}, {
  modifier: ['light', 'smaller'],
})

module.exports = {
  filterFields,
}
