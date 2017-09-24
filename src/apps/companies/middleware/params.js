const { getFormattedAddress } = require('../../../lib/address')
const { getDitCompany, getCHCompany } = require('../repos')

// TODO: Use transformer to return correct address object and handle display
// in view layer
function getHeadingAddress (company) {
  // If this is a CDMS company
  const cdmsTradingAddress = getFormattedAddress(company, 'trading')
  if (cdmsTradingAddress) {
    return cdmsTradingAddress
  }

  if (company.companies_house_data && company.companies_house_data !== null) {
    return getFormattedAddress(company.companies_house_data, 'registered')
  }

  return getFormattedAddress(company, 'registered')
}

async function getCompany (req, res, next, id) {
  try {
    const company = await getDitCompany(req.session.token, id)

    company.address = getHeadingAddress(company)

    res.locals.company = company

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
