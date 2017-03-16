const express = require('express')
const Q = require('q')
const winston = require('winston')
const { ukOtherCompanyOptions, foreignOtherCompanyOptions } = require('../options')
const { genCSRF, isBlank, toQueryString } = require('../lib/controllerutils')
const searchService = require('../services/searchservice')
const companyRepository = require('../repositorys/companyrepository')
const companyFormattingService = require('../services/companyformattingservice')
const { companyDetailLabels, chDetailLabels, companyTypeOptions } = require('../labels/companylabels')

const router = express.Router()

function getAddStepOne (req, res, next) {
  res.render('company/add-step-1.html', {
    ukOtherCompanyOptions,
    foreignOtherCompanyOptions,
    company: req.body,
    companyTypeOptions,
    companyDetailLabels
  })
}

function postAddStepOne (req, res, next) {
  // validate, if bad then generate errors, and show form again
  const errors = {}

  if (isBlank(req.body.business_type)) {
    errors.business_type = ['You must select a company type']
  }

  if (req.body.business_type === 'ukother' && isBlank(req.body.business_type_uk_other)) {
    errors.business_type_uk_other = ['You must select the type of business']
  }

  if (req.body.business_type === 'forother' && isBlank(req.body.business_type_for_other)) {
    errors.business_type_for_other = ['You must select the type of business']
  }

  if (Object.keys(errors).length > 0) {
    res.locals.errors = errors
    return getAddStepOne(req, res)
  }

  let params
  switch (req.body.business_type) {
    case 'ltd':
    case 'ltdchild':
      params = {
        business_type: req.body.business_type,
        country: 'uk'
      }
      break
    case 'ukother':
      params = {
        business_type: req.body.business_type_uk_other,
        country: 'uk'
      }
      break
    case 'forother':
      params = {
        business_type: req.body.business_type_for_other,
        country: 'non-uk'
      }
      break
  }

  if (req.body.business_type === 'ukother' || req.body.business_type === 'forother') {
    return res.redirect(`/company/add?${toQueryString(params)}`)
  }

  return res.redirect(`/company/add-step-2/?${toQueryString(params)}`)
}

function getAddStepTwo (req, res, next) {
  // If there is no search, just render.
  res.locals.companyTypeOptions = companyTypeOptions

  if (isBlank(req.query.term)) {
    return res.render('company/add-step-2.html', req.query)
  }

  Q.spawn(function * () {
    try {
      const paramsSansSelected = Object.assign({}, req.query)
      delete paramsSansSelected.selected
      delete paramsSansSelected.type

      const results = yield searchService.searchLimited(req.session.token, req.query.term)

      // Parse the result and generate a link for more details and indicate if this is a currentlt selected company
      const hits = results.hits.map((hit) => {
        const parsedHit = hit._source
        parsedHit.type = hit._type
        if (hit._type === 'company_company') {
          parsedHit.url = `/company/add-step-2/?${toQueryString(paramsSansSelected)}&type=${parsedHit.type}&selected=${parsedHit.id}`
        } else {
          parsedHit.url = `/company/add-step-2/?${toQueryString(paramsSansSelected)}&type=${parsedHit.type}&selected=${parsedHit.company_number}`
        }

        // indicate if this is the currently selected hit
        if (!isBlank(req.query.selected)) {
          if (req.query.type === 'company_company' && req.query.selected === parsedHit.id) {
            parsedHit.selected = true
          } else if (req.query.selected === parsedHit.company_number) {
            parsedHit.selected = true
          }
        }

        return parsedHit
      })

      const data = Object.assign({}, req.query, { hits })

      // if have search results, but no company is currently selected, render the page.
      if (isBlank(req.query.selected)) {
        return res.render('company/add-step-2.html', data)
      }

      // Figure out if we need to fetch a CH record or a CDMS record, then go get it
      const { selected, type } = req.query

      const company = yield companyRepository.getCompany(req.session.token, selected, type)
      data.company = company
      data.chDisplay = companyFormattingService.getDisplayCH(data.company)
      data.chDetailLabels = chDetailLabels
      data.closeLink = `/company/add-step-2/?${toQueryString(paramsSansSelected)}`
      data.chDetailsDisplayOrder = ['business_type', 'company_status', 'incorporation_date', 'sic_code']
      res.render('company/add-step-2.html', data)
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

router.get('/company/add-step-1/', getAddStepOne)
router.post('/company/add-step-1/', postAddStepOne)
router.get('/company/add-step-2/', getAddStepTwo)

module.exports = { router }
