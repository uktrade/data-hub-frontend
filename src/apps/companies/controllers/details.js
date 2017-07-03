const { accountManagementDisplayLabels } = require('../labels')
const { getDisplayCompany } = require('../services/formatting')
const { LTD, UKOTHER, FOREIGN } = require('../services/data')

const keys = {}
keys[LTD] = ['alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']
keys[UKOTHER] = ['business_type', 'registered_address', 'alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']
keys[FOREIGN] = ['business_type', 'registered_address', 'alias', 'trading_address', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']

async function getDetails (req, res, next) {
  try {
    if (!res.locals.company) {
      return next()
    }

    const company = res.locals.company
    const companyDetails = getDisplayCompany(company)
    const companyDetailsDisplayOrder = keys[res.locals.companyType]

    const accountManagementDisplay = {
      oneListTier: (company.classification && company.classification !== null && company.classification.name) ? company.classification.name : 'None',
      oneListAccountManager: 'None',
    }

    res.render('companies/views/details', {
      accountManagementDisplay,
      accountManagementDisplayLabels,
      companyDetails,
      companyDetailsDisplayOrder,
      tab: 'details',
      title: [res.locals.headingName, 'Companies'],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
}
