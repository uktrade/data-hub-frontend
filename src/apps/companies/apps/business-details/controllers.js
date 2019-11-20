/* eslint-disable camelcase */

const { transformCompanyToBusinessDetails } = require('./transformers')
const { getCompanySubsidiaries } = require('../../repos')
const urls = require('../../../../lib/urls')

async function renderBusinessDetails (req, res) {
  const { company, ARCHIVED_DOCUMENT_BASE_URL, csrfToken } = res.locals
  const subsidiaries = await getCompanySubsidiaries(req.session.token, company.id)

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Business details')
    .render('companies/apps/business-details/views/client-container', {
      heading: 'Business details',
      props: {
        businessDetails: transformCompanyToBusinessDetails(company),
        subsidiariesCount: subsidiaries.count,
        urls: {
          companiesHouse: urls.external.companiesHouse(company.company_number),
          companyBusinessDetails: urls.companies.businessDetails2(company.id),
          companyEdit: urls.companies.edit(company.id),
          companyArchive: `${urls.companies.archive(company.id)}?_csrf=${csrfToken}`,
          companyUnarchive: `${urls.companies.unarchive(company.id)}?_csrf=${csrfToken}`,
          companyAdvisers: urls.companies.advisers.index(company.id),
          companyAudit: urls.companies.audit(company.id),
          support: urls.support(),
          subsidiaries: urls.companies.subsidiaries.index(company.id),
          linkSubsidiary: urls.companies.subsidiaries.link(company.id),
          linkGlobalHQ: urls.companies.hierarchies.ghq.link(company.id),
          removeGlobalHQ: urls.companies.hierarchies.ghq.remove(company.id),
          archivedDocument: company.archived_documents_url_path
            ? ARCHIVED_DOCUMENT_BASE_URL + company.archived_documents_url_path
            : undefined,
        },
      },
    })
}

module.exports = {
  renderBusinessDetails,
}
