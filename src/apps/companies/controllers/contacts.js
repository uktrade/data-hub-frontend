const { merge, omit, assign, reject, get } = require('lodash')

const { contactFiltersFields, companyContactSortForm } = require('../../contacts/macros')
const { buildSelectedFiltersSummary } = require('../../builders')

function renderContacts (req, res, next) {
  const { id: companyId, name: companyName } = res.locals.company
  const companyContactFiltersFields = reject(contactFiltersFields, ['name', 'company_name'])

  const sortForm = merge({}, companyContactSortForm, {
    hiddenFields: assign({}, omit(req.query, 'sortby')),
    children: [
      { value: req.query.sortby },
    ],
  })

  const selectedFilters = buildSelectedFiltersSummary(companyContactFiltersFields, req.query)
  const isUKSelected = get(selectedFilters, 'address_country.valueLabel') === 'United Kingdom'

  const visibleFiltersFields = companyContactFiltersFields.filter(field => {
    if (field.name === 'company_uk_region') {
      return isUKSelected
    }
    return true
  })

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb('Contacts')
    .render('companies/views/contacts', {
      sortForm,
      selectedFilters,
      filtersFields: visibleFiltersFields,
      addContactUrl: `/contacts/create?company=${companyId}`,
    })
}

module.exports = {
  renderContacts,
}
