const { map } = require('lodash')
const {
  buildInvestmentSorting,
  buildInvestmentFilters,
} = require('../builders')

function renderInvestmentList (req, res) {
  const sort = buildInvestmentSorting(req.query)
  const filters = buildInvestmentFilters(req.query)
  const filterMacroConfig = map(filters, (filterProps, fieldName) => {
    return Object.assign({}, filterProps, {
      name: fieldName,
      modifier: ['light', 'smaller'],
    })
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
