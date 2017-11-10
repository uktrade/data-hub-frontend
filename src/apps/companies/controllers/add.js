const queryString = require('query-string')

const { buildUkOtherCompanyOptions, buildForeignOtherCompanyOptions } = require('../options')
const { isBlank } = require('../../../lib/controller-utils')
const { companyDetailsLabels, companyTypeOptions } = require('../labels')

function renderAddStepOne (req, res) {
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
    return next()
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

function renderAddStepTwo (req, res, next) {
  res.render('companies/views/add-step-2.njk')
}

module.exports = {
  renderAddStepOne,
  postAddStepOne,
  renderAddStepTwo,
}
