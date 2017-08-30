const { ukOtherCompanyOptions, foreignOtherCompanyOptions } = require('../options')
const { getCHCompany } = require('../repos')
const { buildQueryString } = require('../../../lib/url-helpers')
const { isBlank } = require('../../../lib/controller-utils')
const { searchLimitedCompanies } = require('../../search/services')
const { getDisplayCH, getDisplayCompany } = require('../services/formatting')
const { buildPagination } = require('../../../lib/pagination')
const { companyDetailsLabels, chDetailsLabels, companyTypeOptions } = require('../labels')

function getAddStepOne (req, res, next) {
  res.render('companies/views/add-step-1.njk', {
    ukOtherCompanyOptions,
    foreignOtherCompanyOptions,
    company: req.body,
    companyTypeOptions,
    companyDetailsLabels,
  })
}

function postAddStepOne (req, res, next) {
  // validate, if bad then generate errors, and show form again
  const errorMessages = {}

  if (isBlank(req.body.business_type)) {
    errorMessages.business_type = ['You must select a company type']
  }

  if (req.body.business_type === 'ukother' && isBlank(req.body.business_type_uk_other)) {
    errorMessages.business_type_uk_other = ['You must select a type of organisation']
  }

  if (req.body.business_type === 'foreign' && isBlank(req.body.business_type_for_other)) {
    errorMessages.business_type_for_other = ['You must select a type of organisation']
  }

  if (Object.keys(errorMessages).length > 0) {
    res.locals.errors = {
      messages: errorMessages,
    }
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

  const queryString = buildQueryString(params)

  if (req.body.business_type === 'ukother' || req.body.business_type === 'foreign') {
    return res.redirect(`/companies/add/${req.body.business_type + queryString}`)
  }

  return res.redirect(`/companies/add-step-2/${queryString}`)
}

async function getAddStepTwo (req, res, next) {
  const searchTerm = req.query.term
  const currentlySelected = req.query.selected
  const businessType = req.query.business_type
  const country = req.query.country
  const token = req.session.token

  if (!searchTerm) {
    return res.render('companies/views/add-step-2.njk', {
      companyTypeOptions,
      businessType,
      country,
    })
  }

  try {
    let displayDetails
    let labels

    const companiesHouseAndLtdCompanies = await searchLimitedCompanies({
      token,
      searchTerm,
    })
    const companies = companiesHouseAndLtdCompanies.results
    companies.pagination = buildPagination(req.query, companiesHouseAndLtdCompanies.results)
    const highlightedCompany = companiesHouseAndLtdCompanies.results.find((company) => {
      return company.id === currentlySelected ||
        (company.company_number && company.company_number === currentlySelected)
    })

    if (highlightedCompany) {
      if (highlightedCompany.company_number) {
        const companiesHouseDetails = await getCHCompany(token, highlightedCompany.company_number)
          .then((companiesHouseData) => {
            return {
              company_number: highlightedCompany.company_number,
              companies_house_data: companiesHouseData,
              contacts: [],
              interactions: [],
            }
          })
        displayDetails = await getDisplayCH(companiesHouseDetails.companies_house_data)
        labels = chDetailsLabels
      } else {
        displayDetails = await getDisplayCompany(highlightedCompany)
        labels = companyDetailsLabels
      }
    }

    res.render('companies/views/add-step-2.njk', {
      companyTypeOptions,
      companies,
      searchTerm,
      currentlySelected,
      displayDetails,
      labels,
      businessType,
      country,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAddStepOne,
  postAddStepOne,
  getAddStepTwo,
}
