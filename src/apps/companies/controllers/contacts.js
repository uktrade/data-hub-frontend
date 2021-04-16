const { merge, omit, assign, filter } = require('lodash')

const {
  contactFiltersFields,
  companyContactSortForm,
} = require('../../contacts/macros')
const { buildSelectedFiltersSummary } = require('../../builders')
const urls = require('../../../lib/urls')

function renderContacts(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals
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

  res.locals.title = `Contacts - ${company.name} - Companies`

  res.render('companies/views/contacts', {
    sortForm,
    filtersFields,
    actionButtons,
    selectedFilters: buildSelectedFiltersSummary(filtersFields, req.query),
    props: {
      company,
      breadcrumbs: [
        { link: urls.dashboard(), text: 'Home' },
        { link: urls.companies.index(), text: 'Companies' },
        { link: urls.companies.detail(company.id), text: company.name },
        { text: 'Contacts' },
      ],
      returnUrl,
      dnbRelatedCompaniesCount,
    },
  })
}

module.exports = {
  renderContacts,
}
