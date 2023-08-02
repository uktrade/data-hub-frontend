/* eslint-disable camelcase */

async function renderAccountManagement(req, res) {
  const { company, dnbRelatedCompaniesCount } = res.locals
  const permissions = res.locals.user.permissions

  res.render('companies/apps/account-management/views/client-container', {
    props: {
      dnbRelatedCompaniesCount,
      permissions,
      localNavItems: res.locals.localNavItems,
      flashMessages: res.locals.getMessages(),
      companyId: company.id,
      flashMessages: res.locals.getMessages(),
    },
  })
}

module.exports = {
  renderAccountManagement,
}
