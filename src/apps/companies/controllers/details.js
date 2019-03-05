const config = require('../../../../config')
const {
  transformCompanyToView,
  transformCompaniesHouseToView,
  transformCompanyToOneListView,
} = require('../transformers')

async function renderDetails (req, res) {
  const { company, features } = res.locals

  if (company.duns_number || features['companies-new-layout']) {
    return res.redirect('interactions')
  }

  res
    .breadcrumb(company.name)
    .render('companies/views/_deprecated/details', {
      companyDetails: transformCompanyToView(company),
      accountManagementDetails: transformCompanyToOneListView(company),
      chDetails: company.companies_house_data ? transformCompaniesHouseToView(company.companies_house_data) : null,
      oneListEmail: config.oneList.email,
    })
}

module.exports = {
  renderDetails,
}
