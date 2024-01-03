import filteredCompanies from './../../../../fixtures/v4/search/company/autocomplete.json' assert { type: 'json' }

export const companiesAutocomplete = function (req, res) {
  res.json(filteredCompanies)
}
