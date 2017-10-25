const { assign } = require('lodash')
const queryString = require('query-string')

const logger = require('../../../../config/logger')
const { buildUkOtherCompanyOptions, buildForeignOtherCompanyOptions } = require('../options')
const { getCHCompany } = require('../repos')
const { isBlank } = require('../../../lib/controller-utils')
const { searchLimitedCompanies } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformCompaniesHouseCompanyToListItem } = require('../../companies/transformers')
const { companyDetailsLabels, companyTypeOptions } = require('../labels')

function getAddStepOne (req, res) {
  const ukOtherCompanyOptions = buildUkOtherCompanyOptions()
  const foreignOtherCompanyOptions = buildForeignOtherCompanyOptions()

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
    return res.redirect(`/companies/add?${queryString.stringify(params)}`)
  }

  return res.redirect(`/companies/add-step-2?${queryString.stringify(params)}`)
}

async function getAddStepTwo (req, res, next) {
  const searchTerm = req.query.term
  const businessType = req.query.business_type
  const token = req.session.token
  let results

  if (!searchTerm) {
    return res.render('companies/views/add-step-2.njk', {
      companyTypeOptions,
      businessType,
    })
  }

  try {
    results = await searchLimitedCompanies({
      token,
      searchTerm,
    })
      .then(async (response) => {
        // TODO: Remove the need to make another call to the API to get the companies house details.
        // The search API should return companies house companies and their relevant information
        return Promise.all(response.results.map(async (result) => {
          try {
            result.companies_house_data = await getCHCompany(token, result.company_number)
            result.url = `/companies/add/${result.company_number}`
          } catch (error) {
            logger.error(error)
          }
          return result
        }))
      })
      .then((results) => {
        return {
          page: 1,
          items: results,
          count: results.length,
        }
      })
      .then(
        transformApiResponseToSearchCollection(
          { query: req.query },
          transformCompaniesHouseCompanyToListItem,
          (item) => {
            return assign({}, item, {
              meta: item.meta.filter(x => x.label !== 'Sector'),
            })
          }
        )
      )
  } catch (error) {
    logger.error(error)
  }

  res.render('companies/views/add-step-2.njk', {
    companyTypeOptions,
    results,
    searchTerm,
    businessType,
  })
}

module.exports = {
  getAddStepOne,
  postAddStepOne,
  getAddStepTwo,
}
