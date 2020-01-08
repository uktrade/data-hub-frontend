const { merge, omit, assign, filter } = require('lodash')

const {
  contactFiltersFields,
  companyContactSortForm,
} = require('../../contacts/macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderContacts(req, res) {
  const { company } = res.locals
  const filtersFields = filter(contactFiltersFields, (field) => {
    return ['name', 'archived'].includes(field.name)
  })

  const sortForm = merge({}, companyContactSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [{ value: req.query.sortby }],
  })

  const actionButtons = company.archived
    ? undefined
    : [
        {
          label: 'Add contact',
          url: `/contacts/create?company=${company.id}`,
        },
      ]

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Contacts')
    .render('companies/views/contacts', {
      sortForm,
      filtersFields,
      actionButtons,
      selectedFilters: buildSelectedFiltersSummary(filtersFields, req.query),
    })
}

module.exports = {
  renderContacts,
}
