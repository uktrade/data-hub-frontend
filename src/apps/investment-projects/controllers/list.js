const {
  buildInvestmentSorting,
  buildInvestmentFilters,
  buildMacroConfigFromFormFields,
} = require('../builders')

function renderInvestmentList (req, res) {
  const sort = buildInvestmentSorting(req.query)
  const filters = buildInvestmentFilters(req.query)
  const filterMacroConfig = buildMacroConfigFromFormFields(req.query)

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
