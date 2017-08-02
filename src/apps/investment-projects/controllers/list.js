const { buildInvestmentSorting, buildInvestmentFilters } = require('../builders')

function renderInvestmentList (req, res) {
  res.render('investment-projects/views/list', {
    title: 'Investment Projects',
    sort: buildInvestmentSorting(req.query),
    filters: buildInvestmentFilters(req.query),
  })
}

module.exports = {
  renderInvestmentList,
}
