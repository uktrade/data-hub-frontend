const {
  transformCompanyToView,
  transformCompaniesHouseToView,
  transformCompanyToOneListView,
} = require('../transformers')

function renderDetails (req, res) {
  const company = res.locals.company

  res
    .breadcrumb(company.name)
    .render('companies/views/details', {
      companyDetails: transformCompanyToView(company),
      accountManagementDetails: transformCompanyToOneListView(company),
      chDetails: company.companies_house_data ? transformCompaniesHouseToView(company.companies_house_data) : null,
    })
}

module.exports = {
  renderDetails,
}
