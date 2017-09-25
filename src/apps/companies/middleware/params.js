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
    res.locals.companiesHouseRecord = await getCHCompany(req.session.token, companyNumber)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getCompany,
  getCompaniesHouseRecord,
}
