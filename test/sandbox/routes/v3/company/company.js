var companiesNoResults = require('../../../fixtures/v3/company/companies-no-results.json')
var companyArchivedSubsidiaries = require('../../../fixtures/v3/company/company-archived-subsidiaries')

exports.companies = function (req, res) {
  var subsidiaries = {
    '346f78a5-1d23-4213-b4c2-bf48246a13c3': companyArchivedSubsidiaries,
  }

  res.json(subsidiaries[req.query.global_headquarters_id] || companiesNoResults)
}
