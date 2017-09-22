const { getDitCompany } = require('../repos')
const companyService = require('../services/data')
const companyFormattingService = require('../services/formatting')
const { companyDetailsLabels, accountManagementDisplayLabels } = require('../labels')
const companyWithoutCHKeys = ['business_type', 'registered_address', 'trading_name', 'trading_address', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']

async function getDetails (req, res, next) {
  try {
    res.locals.tab = 'details'
    const company = res.locals.company = await getDitCompany(req.session.token, req.params.id)
    companyService.getCommonTitlesAndlinks(req, res, company)
    res.locals.companyDetails = companyFormattingService.getDisplayCompany(company)
    res.locals.companyDetailsDisplayOrder = companyWithoutCHKeys
    res.locals.companyDetailsLabels = companyDetailsLabels

    res.locals.accountManagementDisplay = {
      oneListTier: (company.classification && company.classification !== null && company.classification.name) ? company.classification.name : 'None',
      oneListAccountManager: 'None',
    }
    res.locals.accountManagementDisplayLabels = accountManagementDisplayLabels

    res.locals.companyType = 'foreign'
    res
      .breadcrumb(company.name)
      .render('companies/views/details')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDetails,
}
