/* eslint new-cap: 0 */
const express = require('express')
const winston = require('winston')
const Q = require('q')
const companyService = require('../services/company.service')
const companyFormService = require('../services/company-form.service')
const companyFormattingService = require('../services/company-formatting.service')
const companyRepository = require('../repos/company.repo')
const metadataRepository = require('../repos/metadata.repo')
const { companyDetailsLabels, chDetailsLabels, accountManagementDisplayLabels, hqLabels } = require('../labels/company-labels')
const { containsFormData, isBlank } = require('../lib/controller-utils')
const router = express.Router()
const companyWithCHKeys = ['alias', 'trading_address', 'uk_region', 'headquarter_type', 'sector', 'website', 'description', 'employee_range', 'turnover_range']
const chDetailsDisplayOrderLong = ['name', 'company_number', 'registered_address', 'business_type', 'company_status', 'incorporation_date', 'sic_code']

function getDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      res.locals.tab = 'details'
      const company = res.locals.company = yield companyService.getInflatedDitCompany(req.session.token, req.params.id)
      companyService.getCommonTitlesAndlinks(req, res, company)
      res.locals.companyDetails = companyFormattingService.getDisplayCompany(company)
      res.locals.companyDetailsDisplayOrder = companyWithCHKeys
      res.locals.companyDetailsLabels = companyDetailsLabels

      if (company.companies_house_data) {
        res.locals.chDetails = companyFormattingService.getDisplayCH(company.companies_house_data)
        res.locals.chDetailsDisplayOrder = chDetailsDisplayOrderLong
        res.locals.chDetailsLabels = chDetailsLabels
      }

      res.locals.accountManagementDisplay = {
        oneListTier: (company.classification && company.classification !== null && company.classification.name) ? company.classification.name : 'None',
        oneListAccountManager: 'None'
      }
      res.locals.accountManagementDisplayLabels = accountManagementDisplayLabels

      res.render('company/details-ltd')
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

function editCommon (req, res, next) {
  res.locals.chDetailsLabels = chDetailsLabels
  res.locals.chDetailsDisplayOrder = chDetailsDisplayOrderLong

  res.locals.regionOptions = metadataRepository.regionOptions
  res.locals.sectorOptions = metadataRepository.sectorOptions
  res.locals.employeeOptions = metadataRepository.employeeOptions
  res.locals.turnoverOptions = metadataRepository.turnoverOptions
  res.locals.headquarterOptions = metadataRepository.headquarterOptions
  res.locals.companyDetailsLabels = companyDetailsLabels
  res.locals.countryOptions = metadataRepository.countryOptions
  res.locals.hqLabels = hqLabels

  if (next) next()
}

function addDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      res.locals.chCompany = yield companyRepository.getCHCompany(req.session.token, req.params.company_number)
      res.locals.chDetails = companyFormattingService.getDisplayCH(res.locals.chCompany)

      if (containsFormData(req)) {
        res.locals.formData = req.body
      } else {
        res.locals.formData = companyFormService.getDefaultLtdFormForCH(res.locals.chCompany)
      }
      res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
      res.render(`company/edit-ltd`)
    } catch (error) {
      next(error)
    }
  })
}

function editDetails (req, res, next) {
  Q.spawn(function * () {
    try {
      if (containsFormData(req)) {
        res.locals.formData = req.body
      } else {
        const company = yield companyRepository.getDitCompany(req.session.token, req.params.id)
        res.locals.formData = companyFormService.getLtdCompanyAsFormData(company)
      }
      res.locals.showTradingAddress = !isBlank(res.locals.formData.trading_address_country)
      res.render(`company/edit-ltd`)
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
        res.redirect(`/company/view/ltd/${savedCompany.id}`)
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

router.get(['/company/edit/ltd/:id', '/company/add/ltd/:company_number'], editCommon)
router.get('/company/view/ltd/:id', getDetails)
router.get('/company/edit/ltd/:id', editDetails)
router.get('/company/add/ltd/:company_number', addDetails)
router.post(['/company/edit/ltd/:id', '/company/add/ltd/:company_number'], postDetails)

module.exports = { router, getDetails, editDetails, addDetails, postDetails, editCommon }
