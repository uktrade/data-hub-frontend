const config = require('../../../../config')
const {
  transformCompanyToView,
  transformCompaniesHouseToView,
  transformCompanyToOneListView,
} = require('../transformers')

async function renderDetails (req, res) {
  const company = res.locals.company
  const view = company.duns_number ? 'companies/views/details' : 'companies/views/_deprecated/details'

  res
    .breadcrumb(company.name)
    .render(view, {
      companyDetails: transformCompanyToView(company),
      accountManagementDetails: transformCompanyToOneListView(company),
      chDetails: company.companies_house_data ? transformCompaniesHouseToView(company.companies_house_data) : null,
      oneListEmail: config.oneList.email,
    })
}

module.exports = {
  renderDetails,
}
