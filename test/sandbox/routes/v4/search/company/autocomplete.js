import filteredCompanies from './../../../../fixtures/v4/search/company/autocomplete.json' with { type: 'json' }

export const companiesAutocomplete = function (req, res) {
  res.json(filteredCompanies)
}
