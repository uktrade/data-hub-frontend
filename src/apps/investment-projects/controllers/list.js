const {
  buildInvestmentSorting,
  buildInvestmentFilters,
} = require('../builders')

const { transformFieldsObjectToMacrosObject } = require('../../transformers')

function renderInvestmentList (req, res) {
  const sort = buildInvestmentSorting(req.query)
  const filters = buildInvestmentFilters(req.query)
  const filterMacroConfig = transformFieldsObjectToMacrosObject(filters, {
    modifier: ['light', 'smaller'],
  })

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
