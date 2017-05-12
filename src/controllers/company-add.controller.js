const express = require('express')
const Q = require('q')
const winston = require('winston')
const { ukOtherCompanyOptions, foreignOtherCompanyOptions } = require('../options')
const { isBlank, toQueryString, genCSRF } = require('../lib/controller-utils')
const searchService = require('../services/search.service')
const companyService = require('../services/company.service')
const companyFormattingService = require('../services/company-formatting.service')
const { companyDetailsLabels, chDetailsLabels, companyTypeOptions } = require('../labels/companylabels')

const router = express.Router()

function getAddStepOne (req, res, next) {
  genCSRF(req, res)
  res.render('company/add-step-1.html', {
    ukOtherCompanyOptions,
    foreignOtherCompanyOptions,
    company: req.body,
    companyTypeOptions,
    companyDetailsLabels
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

  if (req.body.business_type === 'foreign' && isBlank(req.body.business_type_for_other)) {
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
    case 'foreign':
      params = {
        business_type: req.body.business_type_for_other,
        country: 'non-uk'
      }
      break
  }

  if (req.body.business_type === 'ukother' || req.body.business_type === 'foreign') {
    return res.redirect(`/company/add/${req.body.business_type}?${toQueryString(params)}`)
  }

  return res.redirect(`/company/add-step-2/?${toQueryString(params)}`)
}

function getAddStepTwo (req, res, next) {
  genCSRF(req, res)

  // If there is no search, just render.
  res.locals.companyTypeOptions = companyTypeOptions

  if (isBlank(req.query.term)) {
    return res.render('company/add-step-2.html', req.query)
  }

  Q.spawn(function * () {
    try {
      const companyDetails = Object.assign({}, req.query)

      delete companyDetails.selected
      delete companyDetails.type

      const results = yield searchService
        .searchLimited(req.session.token, req.query.term)
        .catch((error) => winston.error(error))

      // Parse the result and generate a link for more details and indicate if this is a current ltd selected company
      res.locals.hits = results.map((hit) => {
        const parsedHit = hit._source
        parsedHit.type = hit._type
        if (hit._type === 'company_company') {
          parsedHit.url = `/company/add-step-2/?${toQueryString(companyDetails)}&type=${parsedHit.type}&selected=${parsedHit.id}`
        } else {
          parsedHit.url = `/company/add-step-2/?${toQueryString(companyDetails)}&type=${parsedHit.type}&selected=${parsedHit.company_number}`
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

      // if have search results, but no company is currently selected, render the page and send through previously selected company information.
      if (isBlank(req.query.selected)) {
        return res.render('company/add-step-2.html', companyDetails)
      }

      // Figure out if we need to fetch a CH record or a CDMS record, then go get it
      const { selected, type } = req.query
      res.locals.closeLink = `/company/add-step-2/?${toQueryString(companyDetails)}`
      res.locals.company = yield companyService.getCompanyForSource(req.session.token, selected, type)
      res.locals.chDetails = companyFormattingService.getDisplayCH(res.locals.company.companies_house_data)
      res.locals.chDetailsLabels = chDetailsLabels
      res.locals.chDetailsDisplayOrder = ['business_type', 'company_status', 'incorporation_date', 'sic_code']

      if (req.query.type === 'company_company') {
        res.locals.addLink = { label: 'Go to company record', url: `/company/edit/ltd/${res.locals.company.id}` }
      } else {
        res.locals.addLink = { label: 'Choose company', url: `/company/add/ltd/${res.locals.company.company_number}` }
      }

      res.render('company/add-step-2.html', companyDetails)
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

router.get('/company/add-step-1/', getAddStepOne)
router.post('/company/add-step-1/', postAddStepOne)
router.get('/company/add-step-2/', getAddStepTwo)

module.exports = { router, getAddStepOne, postAddStepOne, getAddStepTwo }
