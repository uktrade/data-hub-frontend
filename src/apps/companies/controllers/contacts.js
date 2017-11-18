const { merge, omit } = require('lodash')

const { contactFiltersFields: filtersFields, contactSortForm } = require('../macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderContacts (req, res, next) {
  const { id: companyId, name: companyName } = res.locals.company

  const sortForm = merge({}, contactSortForm, {
    hiddenFields: Object.assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(filtersFields, req.query)

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb('Contacts')
    .render('companies/views/contacts', {
      sortForm,
      filtersFields,
      selectedFilters,
      addContactUrl: `/contacts/create?company=${companyId}`,
    })
}

module.exports = {
  renderContacts,
}
