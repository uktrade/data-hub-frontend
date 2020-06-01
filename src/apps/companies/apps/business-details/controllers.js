/* eslint-disable camelcase */

const { pick } = require('lodash')

const { transformCompanyToBusinessDetails } = require('./transformers')
const { getCompanySubsidiaries } = require('../../repos')
const urls = require('../../../../lib/urls')

function canEditOneList(permissions) {
  return (
    permissions &&
    permissions.includes('company.change_company') &&
    permissions.includes(
      'company.change_one_list_tier_and_global_account_manager'
    )
  )
}

async function renderBusinessDetails(req, res) {
  const { token } = req.session
  const {
    company,
    ARCHIVED_DOCUMENT_BASE_URL,
    csrfToken,
    features,
    globalUltimate,
    dnbRelatedCompaniesCount,
  } = res.locals
  const userPermissions = res.locals.user.permissions
  const subsidiaries = await getCompanySubsidiaries(token, company.id)

  res
    .breadcrumb(company.name, urls.companies.detail(company.id))
    .breadcrumb('Business details')
    .render('companies/apps/business-details/views/client-container', {
      heading: 'Business details',
      props: {
        isGlobalUltimateFlagEnabled: features['companies-ultimate-hq'] === true,
        businessDetails: transformCompanyToBusinessDetails(company),
        subsidiariesCount: subsidiaries.count,
        dnbRelatedCompaniesCount,
        globalUltimate: globalUltimate
          ? pick(globalUltimate, ['name', 'url'])
          : undefined,
        urls: {
          companiesHouse: urls.external.companiesHouse(company.company_number),
          companyBusinessDetails: urls.companies.businessDetails(company.id),
          companyEdit: urls.companies.edit(company.id),
          companyArchive: `${urls.companies.archive(
            company.id
          )}?_csrf=${csrfToken}`,
          companyUnarchive: `${urls.companies.unarchive(
            company.id
          )}?_csrf=${csrfToken}`,
          companyAdvisers: urls.companies.advisers.index(company.id),
          companyEditHistory: urls.companies.editHistory.index(company.id),
          support: urls.support(),
          subsidiaries: urls.companies.subsidiaries.index(company.id),
          linkSubsidiary: urls.companies.subsidiaries.link(company.id),
          dnbHierarchy: urls.companies.dnbHierarchy.index(company.id),
          linkGlobalHQ: urls.companies.hierarchies.ghq.link(company.id),
          globalHQ: company.global_headquarters
            ? urls.companies.detail(company.global_headquarters.id)
            : undefined,
          removeGlobalHQ: urls.companies.hierarchies.ghq.remove(company.id),
          archivedDocument: company.archived_documents_url_path
            ? ARCHIVED_DOCUMENT_BASE_URL + company.archived_documents_url_path
            : undefined,
          editOneList: urls.companies.editOneList(company.id),
        },
        canEditOneList: canEditOneList(userPermissions),
      },
    })
}

module.exports = {
  renderBusinessDetails,
}
