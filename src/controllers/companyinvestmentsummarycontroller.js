/* eslint new-cap: 0 */
const express = require('express')
const controllerUtils = require('../lib/controllerutils')
const companyRepository = require('../repositorys/companyrepository')
const metadataRepository = require('../repositorys/metadatarepository')
const investmentFormattingService = require('../services/investmentformattingservice')
const { investmentDetailLabels, investmentProjectsOpenLabels, investmentProjectsClosedLabels, investmentFormLabels } = require('../labels/investmentlabels')
const { managedOptions, investmentTierOptions } = require('../options')
const router = express.Router()
const isBlank = controllerUtils.isBlank

function getInvestment (req, res, next) {
  companyRepository.getCompanyInvestmentSummary(req.session.token, req.params.sourceId)
  .then((investmentSummary) => {
    if (!investmentSummary) {
      req.flash('info', 'Before creating a new investment project, please complete this section.')
      return res.redirect(`/company/company_company/${req.params.sourceId}/investment/edit`)
    } else {
      res.locals.investmentSummary = investmentSummary
      res.locals.investmentDisplay = investmentFormattingService.getInvestmentDetailsDisplay(investmentSummary)
      metadataRepository.getAdvisors(req.session.token)
      .then((advisors) => {
        res.locals.advisors = advisors
        return companyRepository.getCompanyInvestmentProjects(req.session.token, req.params.sourceId)
      })
      .then((investmentProjects) => {
        if (investmentProjects) {
          res.locals.investmentProjects = investmentProjects
          res.locals.investmentProjectsOpen = investmentFormattingService.getOpenInvestmentProjects(investmentProjects)
          res.locals.investmentProjectsClosed = investmentFormattingService.getClosedInvestmentProjects(investmentProjects)
        }

        return res.render('company/investment', {
          tab: 'investment',
          investmentProjectsOpenLabels,
          investmentProjectsClosedLabels,
          investmentDetailLabels,
          investmentTierOptions,
          investmentProjectsOpenKeys: Object.keys(investmentProjectsOpenLabels),
          investmentProjectsClosedKeys: Object.keys(investmentProjectsClosedLabels)
        })
      })
      .catch((error) => {
        if (error.statusCode && error.statusCode === 404) {
          return res.redirect(`/company/company_company/${req.params.sourceId}/investment/edit`)
        }
        next(error)
      })
    }
  })
  .catch((error) => {
    if (error.statusCode && error.statusCode === 404) {
      return res.redirect(`/company/company_company/${req.params.sourceId}/investment/edit`)
    }
    next(error)
  })
}

function editInvestment (req, res, next) {
  metadataRepository.getAdvisors(req.session.token)
    .then((advisors) => {
      res.locals.advisors = advisors
      return companyRepository.getCompanyInvestmentSummaryLite(req.session.token, req.params.sourceId)
    })
    .then((investmentSummary) => {
      res.render('company/investmentform', {
        tab: 'investment',
        investmentTierOptions,
        investmentFormLabels,
        investmentSummary,
        countries: metadataRepository.countryOptions.map((country) => country.name)
      })
    })
}

function postInvestment (req, res) {
  delete req.body._csrf_token

  const errors = validateInvestment(req.body)
  if (errors) {
    res.locals.errors = errors
    return editInvestment(req, res)
  }

  companyRepository.saveCompanyInvestmentSummary(req.session.token, req.body)
  .then((result) => {
    res.redirect(`/company/company_company/${req.params.sourceId}/investment`)
  })
  .catch((error) => {
    if (error.errors) {
      req.errors = error.errors
    } else {
      res.errors = error
    }
    return editInvestment(req, res)
  })
}

function validateInvestment (data) {
  const errors = {}
  if (isBlank(data.investment_tier)) {
    errors.investment_tier = ['You must select an investment tier']
  }

  if (isBlank(data.ownership)) {
    errors.ownership = ['You must select a country of ownership']
  }
  if (managedOptions.includes(data.investment_tier) && isBlank(data.investment_account_manager)) {
    errors.investment_account_manager = ['You must provide an investment account manager']
  }
  if (data.ownership === 'foreign' && isBlank(data.ownership_country)) {
    errors.ownership_country = ['You must provide the name of the country that this companys owner is registered in']
  }

  if (Object.keys(errors).length > 0) {
    return errors
  }

  return null
}

router.get('/company/:source/:sourceId/investment', getInvestment)
router.get('/company/:source/:sourceId/investment/edit', editInvestment)
router.post('/company/:source/:sourceId/investment/edit', postInvestment)

module.exports = { router }
