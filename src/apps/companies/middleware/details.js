const { getFormattedAddress } = require('../../../lib/address')
const { isValidGuid } = require('../../../lib/controller-utils')
const repos = require('../repos')

async function getCompanyDetails (req, res, next) {
  const id = req.params.companyId
  const token = req.session.token

  if (isValidGuid(id)) {
    try {
      const company = res.locals.company = await repos.getDitCompany(token, id)
      res.locals.headingName = getHeadingName(company)
      res.locals.headingAddress = getHeadingAddress(company)
    } catch (error) {
      return next(error)
    }
  }

  next()
}

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

function getHeadingName (company) {
  if (company.trading_name && company.trading_name.length > 0) {
    return company.trading_name
  }
  return company.name
}

module.exports = {
  getCompanyDetails,
}
