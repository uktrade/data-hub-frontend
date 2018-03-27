const { get, isUndefined } = require('lodash')

const { hqLabels } = require('../labels')
const { getDitCompany, getCHCompany } = require('../repos')
const { getCompanyAddress } = require('../transformers/shared')

async function getCompany (req, res, next, id) {
  try {
    const company = await getDitCompany(req.session.token, id)
    const address = getCompanyAddress(company)
    const headquarterType = get(company, 'headquarter_type.name')

    res.locals.company = company
    res.locals.headingAddress = get(address, 'value')
    res.locals.companiesHouseCategory = get(company, 'companies_house_data.company_category')
    res.locals.metaItems = []

    if (!isUndefined(headquarterType)) {
      res.locals.metaItems.push({
        type: 'badge',
        label: 'Headquarter type',
        value: hqLabels[headquarterType],
      })
    }

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
