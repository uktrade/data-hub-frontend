const { assign, get, omit, merge } = require('lodash')
const { contactFiltersFields, contactSortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderContactList (req, res) {
  const query = req.query

  const sortForm = merge({}, contactSortForm, {
    hiddenFields: assign({}, omit(query, 'sortby')),
    children: [
      { value: query.sortby },
    ],
  })

  const filtersFields = contactFiltersFields(res.locals.facets)
  const selectedFilters = buildSelectedFiltersSummary(filtersFields, query)

  res.render('collection', {
    sortForm,
    selectedFilters,
    filtersFields,
    countLabel: 'contact',
    highlightTerm: get(selectedFilters, 'name.valueLabel'),
  })
}

module.exports = {
  renderContactList,
}
