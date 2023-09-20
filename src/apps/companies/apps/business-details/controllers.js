/* eslint-disable camelcase */

const { pick } = require('lodash')

const { getCompanySubsidiaries } = require('../../repos')

async function renderBusinessDetails(req, res) {
  const { company, globalUltimate, dnbRelatedCompaniesCount } = res.locals
  const permissions = res.locals.user.permissions
  const subsidiaries = await getCompanySubsidiaries(req, company.id)

  res.render('companies/apps/business-details/views/client-container', {
    props: {
      subsidiariesCount: subsidiaries.count,
      dnbRelatedCompaniesCount,
      globalUltimate: globalUltimate
        ? pick(globalUltimate, ['name', 'url'])
        : undefined,
      permissions,
      localNavItems: res.locals.localNavItems,
      flashMessages: res.locals.getMessages(),
      companyId: company.id,
    },
  })
}

module.exports = {
  renderBusinessDetails,
}
