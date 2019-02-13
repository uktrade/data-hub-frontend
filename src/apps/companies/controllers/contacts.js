const { merge, omit, assign } = require('lodash')

const { companyContactSortForm } = require('../../contacts/macros')

async function renderContacts (req, res) {
  const { company } = res.locals

  const sortForm = merge({}, companyContactSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const actionButtons = company.archived ? undefined : [{
    label: 'Add contact',
    url: `/contacts/create?company=${company.id}`,
  }]

  const view = company.duns_number ? 'companies/views/contacts' : 'companies/views/_deprecated/contacts'

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Contacts')
    .render(view, {
      sortForm,
      actionButtons,
    })
}

module.exports = {
  renderContacts,
}
