var investmentProjects = require('../../../fixtures/v3/search/investment-project.json')

exports.investmentProjects = function(req, res) {
  res.json(investmentProjects)
}
