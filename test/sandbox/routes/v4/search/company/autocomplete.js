var filteredCompanies = require('./../../../../fixtures/v4/search/company/autocomplete.json')

exports.companiesAutocomplete = function (req, res) {
  res.json(filteredCompanies)
}
