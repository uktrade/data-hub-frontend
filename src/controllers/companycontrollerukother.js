/* eslint new-cap: 0 */
const express = require('express')
const winston = require('winston')
const Q = require('q')
const companyRepository = require('../repositorys/companyrepository')
const companyFormService = require('../services/companyformservice')
const companyService = require('../services/companyservice')
const companyFormattingService = require('../services/companyformattingservice')
const { companyDetailsLabels, accountManagementDisplayLabels, hqLabels } = require('../labels/companylabels')
const metadataRepository = require('../repositorys/metadatarepository')
const { genCSRF, containsFormData, isBlank } = require('../lib/controllerutils')
const router = express.Router()
const companyWithoutCHKeys = ['business_type', 'registered_address', 'alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']

function getDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      res.locals.tab = 'details'
      const company = res.locals.company = yield companyService.getInflatedDitCompany(req.session.token, req.params.id)
      companyService.getCommonTitlesAndlinks(company, res)
      res.locals.companyDetails = companyFormattingService.getDisplayCompany(company)
      res.locals.companyDetailsDisplayOrder = companyWithoutCHKeys
      res.locals.companyDetailsLabels = companyDetailsLabels

      res.locals.accountManagementDisplay = {
        oneListTier: (company.classification && company.classification !== null && company.classification.name) ? company.classification.name : 'None',
        oneListAccountManager: 'None'
      }
      res.locals.accountManagementDisplayLabels = accountManagementDisplayLabels

      res.render('company/details-ukother')
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

function editCommon (req, res, next) {
  res.locals.regionOptions = metadataRepository.regionOptions
  res.locals.sectorOptions = metadataRepository.sectorOptions
  res.locals.employeeOptions = metadataRepository.employeeOptions
  res.locals.turnoverOptions = metadataRepository.turnoverOptions
  res.locals.headquarterOptions = metadataRepository.headquarterOptions
  res.locals.companyDetailsLabels = companyDetailsLabels
  res.locals.hqLabels = hqLabels
  genCSRF(req, res)
  if (next) next()
}

function addDetails (req, res, next) {
  if (containsFormData(req)) {
    res.locals.formData = req.body
  } else {
    res.locals.formData = {}
  }
  res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
  res.render(`company/edit-ukother`)
}

function editDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      if (containsFormData(req)) {
        res.locals.formData = req.body
      } else {
        const company = yield companyRepository.getDitCompany(req.session.token, req.params.id)
        res.locals.formData = companyFormService.getUkOtherCompanyAsFormData(company)
      }
      res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
      res.render(`company/edit-ukother`)
    } catch (error) {
      next(error)
    }
  })
}

function postDetails (req, res, next) {
  return new Promise((resolve, reject) => {
    Q.spawn(function * () {
      try {
        const savedCompany = yield companyFormService.saveCompanyForm(req.session.token, req.body)
        req.flash('success-message', 'Updated company record')
        res.redirect(`/company/view/ukother/${savedCompany.id}`)
      } catch (response) {
        winston.debug(response)
        if (response.errors) {
          // Leeloo has inconsistant structure to return errors.
          // Get the errors and then re-render the edit page.
          if (response.errors.errors) {
            res.locals.errors = response.errors.errors
          } else {
            res.locals.errors = response.errors
          }

          // re-edit the data
          editCommon(req, res)
          if (req.params.id) {
            editDetails(req, res, next)
          } else {
            addDetails(req, res, next)
          }
        } else {
          next(response)
        }
      }
    })
  })
}

router.get(['/company/edit/ukother/:id', '/company/add/ukother'], editCommon)
router.get('/company/view/ukother/:id', getDetails)
router.get('/company/edit/ukother/:id', editDetails)
router.get('/company/add/ukother', addDetails)
router.post(['/company/edit/ukother/:id', '/company/add/ukother'], postDetails)

module.exports = { router, getDetails, editDetails, addDetails, postDetails, editCommon }
