/* eslint new-cap: 0 */
const express = require('express')
const winston = require('winston')
const companyRepository = require('../repositorys/companyrepository')
const metadataRepository = require('../repositorys/metadatarepository')
const companyService = require('../services/companyservice')
const companyFormattingService = require('../services/companyformattingservice')
const { companyDetailsLabels, chDetailsLabels, hqLabels, accountManagementDisplayLabels } = require('../labels/companylabels')
const { isBlank, toQueryString, genCSRF } = require('../lib/controllerutils')
const router = express.Router()
const companyWithoutCHKeys = ['business_type', 'registered_address', 'alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']
const companyWithCHKeys = ['alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']
const chDetailsDisplayOrderLong = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']
const chDetailsDisplayOrderShort = ['name', 'company_number', 'registered_address', 'business_type']
let unitedKingdom

function getCommon (req, res, next) {
  const id = req.params.sourceId
  const source = req.params.source
  companyService.getCompanyForSource(req.session.token, id, source)
  .then((company) => {
    res.locals.headingName = companyFormattingService.getHeadingName(company)
    res.locals.headingAddress = companyFormattingService.getHeadingAddress(company)
    res.locals.id = id
    res.locals.source = source
    res.locals.company = company

    if (company.archived) {
      res.locals.unarchiveUrl = getUnarchiveUrl(req)
    } else {
      if (req.query.archive) {
        res.locals.cancelArchiveUrl = getCancelArchiveUrl(req)
      } else {
        res.locals.archiveUrl = getArchiveUrl(req)
      }
    }

    next()
  })
  .catch((error) => {
    winston.error(error)
    next()
  })
}

// Figure out the business type using either the existing company business type
// the companies house type or type sent in the request for a new company
function calculateBusinessType (company, req) {
  if (company && company.business_type && company.business_type !== null && typeof company.business_type === 'object') {
    return company.business_type
  } else if (company && company.companies_house_data) {
    for (const businessType of metadataRepository.businessTypeOptions) {
      if (businessType.name.toLowerCase() === company.companies_house_data.company_category.toLowerCase()) {
        return businessType
      }
    }
  } else if (req.query && req.query.business_type) {
    for (const businessType of metadataRepository.businessTypeOptions) {
      if (businessType.name.toLowerCase() === req.query.business_type.toLowerCase()) {
        return businessType
      }
    }
  }

  // Worst case, return undefined
  for (const businessType of metadataRepository.businessTypeOptions) {
    if (businessType.name.toLowerCase() === 'undefined') {
      return businessType
    }
  }
}

function getDetails (req, res, next) {
  try {
    const company = res.locals.company
    res.locals.tab = 'details'

    if (company && company.companies_house_data && company.companies_house_data !== null) {
      res.locals.chDetails = companyFormattingService.getDisplayCH(company)
      res.locals.chDetailsDisplayOrder = chDetailsDisplayOrderLong
      res.locals.chDetailsLabels = chDetailsLabels
    }

    if (company && company.id && company.id !== null) {
      res.locals.companyDetails = companyFormattingService.getDisplayCompany(company)
      res.locals.companyDetailsDisplayOrder = (res.locals.chDetails) ? companyWithCHKeys : companyWithoutCHKeys
      res.locals.companyDetailsLabels = companyDetailsLabels
      res.locals.accountManagementDisplay = {
        oneListTier: (company.classification && company.classification !== null && company.classification.name) ? company.classification.name : 'None',
        oneListAccountManager: 'None'
      }
      res.locals.accountManagementDisplayLabels = accountManagementDisplayLabels
    }

    res.render('company/details')
  } catch (error) {
    next(error)
  }
}

function editDetails (req, res) {
  const company = res.locals.company || {}
  genCSRF(req, res)

  if (company.companies_house_data && company.companies_house_data.company_number) {
    res.locals.chDetails = companyFormattingService.getDisplayCH(company)
    res.locals.chDetailsLabels = chDetailsLabels
    res.locals.chDetailsDisplayOrder = chDetailsDisplayOrderShort
  }

  const businessType = res.locals.business_type = calculateBusinessType(company, req)
  const ukBased = res.locals.uk_based = (company.companies_house_data || company.uk_based || (req.query && req.query.country && req.query.country === 'uk'))

  let template
  if (businessType && businessType.name && businessType.name.toLowerCase() === 'private limited company' || businessType.name.toLowerCase() === 'public limited company') {
    template = 'edit-ltd'
  } else if (!ukBased) {
    template = 'edit-nonuk'
  } else {
    template = 'edit-ukother'
    // pass the id for the UK to use for addresses.
    if (!unitedKingdom && metadataRepository.countryOptions) {
      unitedKingdom = metadataRepository.countryOptions.filter(option => option.name.toLowerCase() === 'united kingdom')[0].id
    }
    res.locals.unitedKingdom = unitedKingdom
    res.locals.uk_based = true
  }

  if (!isBlank(company.trading_address_country)) {
    res.locals.showTradingAddress = true
  } else {
    res.locals.showTradingAddress = false
  }

  res.render(`company/${template}`, {
    companyDetailsLabels,
    regionOptions: metadataRepository.regionOptions,
    sectorOptions: metadataRepository.sectorOptions,
    employeeOptions: metadataRepository.employeeOptions,
    turnoverOptions: metadataRepository.turnoverOptions,
    countryOptions: metadataRepository.countryOptions,
    headquarterOptions: metadataRepository.headquarterOptions,
    hqLabels
  })
}

function postDetails (req, res, next) {
  companyRepository.saveCompany(req.session.token, req.body)
    .then((data) => {
      req.flash('success-message', 'Updated company record')
      res.redirect(`/company/company_company/${data.id}/details`)
    })
    .catch((error) => {
      winston.debug(error)
      if (error.errors) {
        winston.debug(error)
        // Leeloo has inconsistant structure to return errors.
        // Get the errors and then re-render the edit page.
        if (error.errors.errors) {
          res.locals.errors = error.errors.errors
        } else {
          res.locals.errors = error.errors
        }

        // Call get common to get the data you would normally have got before an edit
        // and merge it with the data posted.
        getCommon(req, res, function () {
          res.locals.company = Object.assign({}, res.locals.company, req.body)
          editDetails(req, res, next)
        })
      } else {
        return next(error)
      }
    })
}

function getExport (req, res) {
  res.render('company/export', {tab: 'export'})
}

function postArchive (req, res) {
  res.redirect(`/company/company_company/${req.params.sourceId}/details`)
}

function getArchiveUrl (req) {
  const query = Object.assign({}, req.query)
  query.archive = true
  const queryParams = toQueryString(query)
  const fullUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}?${queryParams}`
  return fullUrl
}

function getUnarchiveUrl (req) {
  const query = Object.assign({}, req.query)
  query.unarchive = true
  const queryParams = toQueryString(query)
  const fullUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}?${queryParams}`
  return fullUrl
}

function getCancelArchiveUrl (req) {
  return `${req.protocol}://${req.get('host')}${req.baseUrl}`
}

router.use('/company/:source/:sourceId/*', getCommon)
router.get(['/company/:source/:sourceId/edit', '/company/add'], editDetails)
router.post(['/company/:source/:sourceId/edit', '/company/add'], postDetails)
router.get('/company/:source/:sourceId/details', getDetails)
router.get('/company/:source/:sourceId/export', getExport)
router.post('/company/:source/:sourceId/archive', postArchive)

module.exports = { router, editDetails, getCommon, postDetails, getDetails }
