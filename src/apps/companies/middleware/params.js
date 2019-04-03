const { getDitCompany, getCHCompany } = require('../repos')

async function getCompany (req, res, next, id) {
  try {
    res.locals.company = await getDitCompany(req.session.token, id)
    next()
  } catch (error) {
    next(error)
  }
}

async function getCompaniesHouseRecord (req, res, next, companyNumber) {
  try {
    const companiesHouseRecord = await getCHCompany(req.session.token, companyNumber)
    res.locals.companiesHouseCategory = companiesHouseRecord.company_category
    res.locals.companiesHouseRecord = companiesHouseRecord
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompany,
  getCompaniesHouseRecord,
}
