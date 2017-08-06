const {
  buildInvestmentSorting,
  buildInvestmentFilters,
  buildInvestmentFiltersMacroConfig,
} = require('../builders')

function renderInvestmentList (req, res) {
  const sort = buildInvestmentSorting(req.query)
  const filters = buildInvestmentFilters(req.query, req.session.user)
  const filterMacroConfig = buildInvestmentFiltersMacroConfig(filters)

  res.render('investment-projects/views/list', {
    title: 'Investment Projects',
    sort,
    filters,
    filterMacroConfig,
  })
}

module.exports = {
  renderInvestmentList,
}
