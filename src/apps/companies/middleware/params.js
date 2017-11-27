const { get } = require('lodash')

const { getDitCompany, getCHCompany } = require('../repos')
const { getCompanyAddress } = require('../transformers/shared')

async function getCompany (req, res, next, id) {
  try {
    const company = await getDitCompany(req.session.token, id)
    const address = getCompanyAddress(company)

    res.locals.company = company
    res.locals.headingAddress = get(address, 'value')
    res.locals.companiesHouseCategory = get(company, 'companies_house_data.company_category')
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
