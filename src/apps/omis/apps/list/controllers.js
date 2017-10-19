const { assign, merge, omit } = require('lodash')

const { buildSelectedFiltersSummary } = require('../../../builders')
const { collectionFiltersFields, collectionSortForm } = require('./macros')

function renderCollectionList (req, res) {
  const sortForm = merge({}, collectionSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(collectionFiltersFields, req.query)

  res.render('omis/apps/list/views/list-collection', {
    sortForm,
    selectedFilters,
    filtersFields: collectionFiltersFields,
  })
}

function renderReconciliationList (req, res) {
  res.render('omis/apps/list/views/list-reconciliation')
}

module.exports = {
  renderCollectionList,
  renderReconciliationList,
}
