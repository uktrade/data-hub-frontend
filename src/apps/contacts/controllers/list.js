const { get, omit, merge } = require('lodash')
const { contactFiltersFields: filtersFields, contactSortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderContactList (req, res) {
  const sortForm = merge({}, contactSortForm, {
    hiddenFields: omit(req.query, 'sortby'),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  res.render('_layouts/collection', {
    sortForm,
    filtersFields,
    selectedFilters,
    title: 'Contacts',
    countLabel: 'contact',
    highlightTerm: get(selectedFilters, 'name.valueLabel'),
  })
}

module.exports = {
  renderContactList,
}
