/* eslint-disable camelcase */

const { pick } = require('lodash')

const { getCompanySubsidiaries } = require('../../repos')

async function renderBusinessDetails(req, res) {
  const {
    company,
    ARCHIVED_DOCUMENT_BASE_URL,
    globalUltimate,
    dnbRelatedCompaniesCount,
  } = res.locals
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
      archivedDocumentUrl: company.archived_documents_url_path
        ? ARCHIVED_DOCUMENT_BASE_URL + company.archived_documents_url_path
        : undefined,
    },
  })
}

module.exports = {
  renderBusinessDetails,
}
