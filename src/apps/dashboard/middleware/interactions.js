const { getDitCompany } = require('../../companies/repos')

async function setCompanyDetails(req, res, next) {
  const { companyExport } = res.locals
  res.locals.company = await getDitCompany(req, companyExport.company.id)
  next()
}

module.exports = {
  setCompanyDetails,
}
