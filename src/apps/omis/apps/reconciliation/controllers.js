const { assign, merge, omit } = require('lodash')

const { buildSelectedFiltersSummary, hydrateFiltersFields } = require('../../../../modules/form/builders/filters')
const {
  filtersFields,
  reconciliationSortForm,
} = require('./macros')

async function renderList (req, res) {
  const { token } = req.session
  const sortForm = merge({}, reconciliationSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const hydratedFiltersFields = await hydrateFiltersFields(token, filtersFields, req.query)
  const selectedFiltersSummary = buildSelectedFiltersSummary(hydratedFiltersFields, req.query)

  res
    .render('omis/apps/reconciliation/views/list-reconciliation', {
      sortForm,
      selectedFiltersSummary,
      filtersFields: hydratedFiltersFields,
    })
}

module.exports = {
  renderList,
}
