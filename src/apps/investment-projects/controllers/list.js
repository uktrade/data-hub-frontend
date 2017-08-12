const { buildInvestmentFilters } = require('../builders')
const { buildSortObject } = require('../../builders')
const { INVESTMENT_PROJECTS_SORT_OPTIONS } = require('../constants')

const { transformFieldsObjectToMacrosObject } = require('../../transformers')

function renderInvestmentList (req, res) {
  const sort = buildSortObject(INVESTMENT_PROJECTS_SORT_OPTIONS, req.query)
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
