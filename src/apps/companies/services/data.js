/* eslint camelcase: 0 */
const { get } = require('lodash')
const { getFormattedAddress } = require('../../../lib/address')

/**
 * Pass an API formatted company record in and return a path to view that company depending on company type
 *
 * @param {Object} company
 *
 * @returns {string} urlPath
 */
function buildCompanyUrl (company) {
  const companyPath = '/companies/view'
  const businessType = get(company, 'business_type.name', '').toLowerCase()
  let urlPath

  if (!company.uk_based) {
    urlPath = `${companyPath}/foreign/${company.id}`
  } else if (businessType.includes('limited company')) {
    urlPath = `${companyPath}/ltd/${company.id}`
  } else {
    urlPath = `${companyPath}/ukother/${company.id}`
  }

  return urlPath
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
  if (company.id) {
    if (company.trading_name && company.trading_name.length > 0) {
      return company.trading_name
    }
    return company.name
  } else {
    return company.companies_house_data.name
  }
}

function getCommonTitlesAndlinks (req, res, company) {
  res.locals.headingName = getHeadingName(company)
  res.locals.headingAddress = getHeadingAddress(company)
  res.locals.companyUrl = buildCompanyUrl(company)
}

module.exports = {
  buildCompanyUrl,
  getCommonTitlesAndlinks,
  getHeadingAddress,
}
