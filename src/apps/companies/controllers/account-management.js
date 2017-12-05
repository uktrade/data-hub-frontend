const { get, merge, pickBy } = require('lodash')

const { accountManagementFormConfig } = require('../macros')
const { buildFormWithStateAndErrors } = require('../../builders')

function renderAccountManagementEditPage (req, res) {
  const { one_list_account_owner } = res.locals.company
  const mergedCompanyData = pickBy(merge({}, { one_list_account_owner }, res.locals.requestBody))

  const accountManagementForm =
    buildFormWithStateAndErrors(
      accountManagementFormConfig({
        returnLink: `/companies/${res.locals.company.id}`,
        advisers: res.locals.advisers,
      }),
      mergedCompanyData,
      get(res.locals, 'form.errors.messages'),
    )

  res
    .breadcrumb('Edit account management')
    .title(`Edit account management for ${res.locals.company.name}`)
    .render('companies/views/account-management-edit', {
      accountManagementForm,
    })
}

module.exports = {
  renderAccountManagementEditPage,
}
