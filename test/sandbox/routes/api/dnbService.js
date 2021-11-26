var companiesSearch = require('../../fixtures/dnb/companies-search.json')

exports.companiesSearch = function (req, res) {
  res.json(companiesSearch)
}
