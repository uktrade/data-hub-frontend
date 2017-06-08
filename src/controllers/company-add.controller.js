const express = require('express')
const Q = require('q')
const { ukOtherCompanyOptions, foreignOtherCompanyOptions } = require('../options')
const { getCHCompany } = require('../repos/company.repo')
const { isBlank, toQueryString } = require('../lib/controller-utils')
const { searchLimitedCompanies } = require('../services/search.service')
const { getDisplayCH, getDisplayCompany } = require('../services/company-formatting.service')
const { getPagination } = require('../lib/pagination')
const { companyDetailsLabels, chDetailsLabels, companyTypeOptions } = require('../labels/company-labels')

const router = express.Router()

function getAddStepOne (req, res, next) {
  res.render('company/add-step-1.njk', {
    ukOtherCompanyOptions,
    foreignOtherCompanyOptions,
    company: req.body,
    companyTypeOptions,
    companyDetailsLabels,
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
        country: 'uk',
      }
      break
    case 'ukother':
      params = {
        business_type: req.body.business_type_uk_other,
        country: 'uk',
      }
      break
    case 'foreign':
      params = {
        business_type: req.body.business_type_for_other,
        country: 'non-uk',
      }
      break
  }

  if (req.body.business_type === 'ukother' || req.body.business_type === 'foreign') {
    return res.redirect(`/company/add/${req.body.business_type}?${toQueryString(params)}`)
  }

  return res.redirect(`/company/add-step-2/?${toQueryString(params)}`)
}

function getAddStepTwo (req, res, next) {
  const searchTerm = req.query.term
  const currentlySelected = req.query.selected
  const businessType = req.query.business_type
  const country = req.query.country
  const token = req.session.token

  if (!searchTerm) {
    return res.render('company/add-step-2.njk', {
      companyTypeOptions,
      businessType,
      country,
    })
  }

  Q.spawn(function * () {
    try {
      let displayDetails
      let labels

      const companiesHouseAndLtdCompanies = yield searchLimitedCompanies({
        token,
        searchTerm,
      })
      const pagination = getPagination(req, companiesHouseAndLtdCompanies.results)
      const highlightedCompany = companiesHouseAndLtdCompanies.results.find((company) => {
        return company.id === currentlySelected ||
          (company.company_number && company.company_number === currentlySelected)
      })

      if (highlightedCompany) {
        if (highlightedCompany.company_number) {
          const companiesHouseDetails = yield getCHCompany(token, highlightedCompany.company_number)
            .then((companiesHouseData) => {
              return {
                company_number: highlightedCompany.company_number,
                companies_house_data: companiesHouseData,
                contacts: [],
                interactions: [],
              }
            })
          displayDetails = yield getDisplayCH(companiesHouseDetails.companies_house_data)
          labels = chDetailsLabels
        } else {
          displayDetails = yield getDisplayCompany(highlightedCompany)
          labels = companyDetailsLabels
        }
      }

      res.render('company/add-step-2.njk', {
        companyTypeOptions,
        companies: companiesHouseAndLtdCompanies.results,
        searchTerm,
        currentlySelected,
        displayDetails,
        labels,
        businessType,
        country,
        pagination,
      })
    } catch (error) {
      next(error)
    }
  })
}

router.get('/company/add-step-1/', getAddStepOne)
router.post('/company/add-step-1/', postAddStepOne)
router.get('/company/add-step-2/', getAddStepTwo)

module.exports = { router, getAddStepOne, postAddStepOne, getAddStepTwo }
