const { assign, merge, omit } = require('lodash')

const { buildSelectedFiltersSummary } = require('../../../builders')
const {
  filtersFields,
  collectionSortForm,
} = require('./macros')

function renderList (req, res) {
  const sortForm = merge({}, collectionSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  res.render('omis/apps/list/views/list', {
    sortForm,
    selectedFilters,
    filtersFields,
    countLabel: 'order',
  })
}

module.exports = {
  renderList,
}
