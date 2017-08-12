const INVESTMENT_PROJECTS_FILTERS_MACRO_CONFIG = {
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

const INVESTMENT_PROJECTS_SORT_OPTIONS = [
  { value: 'estimated_land_date:asc', label: 'Earliest land date' },
  { value: 'estimated_land_date:desc', label: 'Latest land date' },
  { value: 'project_code', label: 'Project code' },
  { value: 'name:asc', label: 'Project name' },
  { value: 'stage.name', label: 'Stage' },
]

module.exports = {
  INVESTMENT_PROJECTS_FILTERS_MACRO_CONFIG,
  INVESTMENT_PROJECTS_SORT_OPTIONS,
}
