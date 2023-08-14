/* eslint-disable camelcase */

async function renderAccountManagement(req, res) {
  const { company, dnbRelatedCompaniesCount, localNavItems, returnUrl } =
    res.locals
  const permissions = res.locals.user.permissions

  res.render('companies/apps/account-management/views/client-container', {
    props: {
      dnbRelatedCompaniesCount,
      permissions,
      localNavItems: localNavItems,
      flashMessages: res.locals.getMessages(),
      companyId: company.id,
      returnUrl: returnUrl,
    },
  })
}

module.exports = {
  renderAccountManagement,
}
