const FILTERS_MACRO_CONFIG = {
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
}

module.exports = {
  FILTERS_MACRO_CONFIG,
}
