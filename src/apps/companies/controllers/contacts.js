const { merge, omit, assign, filter } = require('lodash')

const { contactFiltersFields, companyContactSortForm } = require('../../contacts/macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderContacts (req, res) {
  const { id: companyId, name: companyName } = res.locals.company
  const filtersFields = filter(contactFiltersFields, (field) => {
    return ['name', 'archived'].includes(field.name)
  })

  const sortForm = merge({}, companyContactSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb('Contacts')
    .render('companies/views/contacts', {
      sortForm,
      filtersFields,
      selectedFilters: buildSelectedFiltersSummary(filtersFields, req.query),
      addContactUrl: `/contacts/create?company=${companyId}`,
    })
}

module.exports = {
  renderContacts,
}
