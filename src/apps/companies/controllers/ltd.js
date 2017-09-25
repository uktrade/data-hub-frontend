const companyService = require('../services/data')
const companyFormattingService = require('../services/formatting')
const { getDitCompany } = require('../repos')
const metadataRepository = require('../../../lib/metadata')
const { companyDetailsLabels, chDetailsLabels, accountManagementDisplayLabels } = require('../labels')
const companyWithCHKeys = ['trading_name', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']
const chDetailsDisplayOrder = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']

async function getDetails (req, res, next) {
  try {
    res.locals.tab = 'details'
    const company = res.locals.company = await getDitCompany(req.session.token, req.params.id)
    companyService.getCommonTitlesAndlinks(req, res, company)
    res.locals.companyDetails = companyFormattingService.getDisplayCompany(company)
    res.locals.companyDetailsDisplayOrder = companyWithCHKeys
    res.locals.companyDetailsLabels = companyDetailsLabels

    if (company.companies_house_data) {
      res.locals.regionOptions = metadataRepository.regionOptions
      res.locals.chDetails = companyFormattingService.getDisplayCH(company.companies_house_data)
      res.locals.chDetailsDisplayOrder = chDetailsDisplayOrder
      res.locals.chDetailsLabels = chDetailsLabels
    }

    res.locals.accountManagementDisplay = {
      oneListTier: (company.classification && company.classification !== null && company.classification.name) ? company.classification.name : 'None',
      oneListAccountManager: 'None',
    }
    res.locals.accountManagementDisplayLabels = accountManagementDisplayLabels

    res.locals.companyType = 'ltd'

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
