import companiesSearch from '../../fixtures/dnb/companies-search.json' with { type: 'json' }

export const createCompaniesSearch = function (req, res) {
  res.json(companiesSearch)
}
