const {
  transformCompanyResponseToViewRecord,
  transformCompaniesHouseResponseToViewRecord,
  transformCompanyResponseToOneListViewRecord,
} = require('../transformers')

function renderDetails (req, res) {
  const company = res.locals.company

  res
    .breadcrumb(company.name)
    .render('companies/views/details', {
      companyDetails: transformCompanyResponseToViewRecord(company),
      accountManagementDetails: transformCompanyResponseToOneListViewRecord(company),
      chDetails: company.companies_house_data ? transformCompaniesHouseResponseToViewRecord(company.companies_house_data) : null,
    })
}

module.exports = {
  renderDetails,
}
