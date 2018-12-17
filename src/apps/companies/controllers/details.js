const { find } = require('lodash')

const config = require('../../../../config')
const {
  transformCompanyToView,
  transformCompaniesHouseToView,
  transformCompanyToOneListView,
} = require('../transformers')
const { getOneListGroupCoreTeam } = require('../repos')

async function renderDetails (req, res) {
  const company = res.locals.company
  const coreTeam = await getOneListGroupCoreTeam(req.session.token, company.id)
  const globalAccountManager = find(coreTeam, adviser => adviser.is_global_account_manager)
  const view = company.duns_number ? 'companies/views/details' : 'companies/views/_deprecated/details'

  res
    .breadcrumb(company.name)
    .render(view, {
      companyDetails: transformCompanyToView(company),
      accountManagementDetails: transformCompanyToOneListView(company, globalAccountManager),
      chDetails: company.companies_house_data ? transformCompaniesHouseToView(company.companies_house_data) : null,
      oneListEmail: config.oneList.email,
    })
}

module.exports = {
  renderDetails,
}
