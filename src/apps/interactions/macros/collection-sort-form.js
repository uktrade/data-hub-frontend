const getSortOptions = (showCompany = true) => {
  return [
    { value: '-date', label: 'Newest' },
    { value: 'company__name', label: 'Company: A-Z' },
    { value: 'subject', label: 'Subject: A-Z' },
  ].filter((o) => o.value !== 'company__name' || showCompany)
}

const buildInteractionSortForm = (showCompany = true) => {
  return {
    method: 'get',
    class: 'c-collection__sort-form js-AutoSubmit',
    hideFormActions: true,
    hiddenFields: { custom: true },
    children: [
      {
        options: getSortOptions(showCompany),
        macroName: 'MultipleChoiceField',
        label: 'Sort by',
        name: 'sortby',
        modifier: ['small', 'inline', 'light'],
      },
    ],
  }
}

const getDefaultInteractionSort = (showCompany = true) =>
  getSortOptions(showCompany)[0].value

module.exports = {
  buildInteractionSortForm,
  getDefaultInteractionSort,
}
