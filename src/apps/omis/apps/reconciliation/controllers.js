const { assign, merge, omit } = require('lodash')

const { buildSelectedFiltersSummary } = require('../../../builders')
const { filtersFields, reconciliationSortForm } = require('./macros')

function renderList(req, res) {
  const sortForm = merge({}, reconciliationSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [{ value: req.query.sortby }],
  })

  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  res.render('omis/apps/reconciliation/views/list-reconciliation', {
    sortForm,
    selectedFilters,
    filtersFields,
  })
}

module.exports = {
  renderList,
}
