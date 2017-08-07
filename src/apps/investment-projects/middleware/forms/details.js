const { get, isEmpty } = require('lodash')

const { transformToApi, transformFromApi } = require('../../services/formatting')
const { isValidGuid } = require('../../../../lib/controller-utils')
const metadata = require('../../../../lib/metadata')
const { getAdvisers } = require('../../../adviser/repos')
const {
  buildMetaDataObj,
  transformObjectToOption,
  transformContactToOption,
} = require('../../../transformers')
const {
  createInvestmentProject,
  getEquityCompanyDetails,
  updateInvestment,
} = require('../../repos')

async function populateForm (req, res, next) {
  const clientCompanyId = req.query['client-company']
  const equityCompanyId = get(res, 'locals.equityCompany.id', req.params.equityCompanyId)

  if (!isValidGuid(equityCompanyId)) {
    return res.redirect('/investment-projects/create')
  }

  try {
    const advisersResponse = await getAdvisers(req.session.token)
    const {
      equityCompany,
      equityCompanyInvestment,
    } = await getEquityCompanyDetails(req.session.token, equityCompanyId)

    const contacts = equityCompany.contacts.map(transformContactToOption)
    const advisers = advisersResponse.results.map(transformObjectToOption)
    const investmentData = transformFromApi(res.locals.investmentData)
    const investmentTypes = metadata.investmentTypeOptions.map(transformObjectToOption).filter((investmentType) => {
      return equityCompany.uk_based || investmentType.label.toLowerCase().includes('fdi')
    })

    res.locals.clientCompanyId = clientCompanyId || equityCompanyId
    res.locals.equityCompany = equityCompany
    res.locals.equityCompanyInvestment = equityCompanyInvestment
    res.locals.form = res.locals.form || {}
    res.locals.form.state = investmentData

    res.locals.form.options = {
      advisers,
      contacts,
      investmentTypes,
      investmentTypesObj: buildMetaDataObj(investmentTypes),
      fdi: metadata.fdiOptions.map(transformObjectToOption),
      nonFdi: metadata.nonFdiOptions.map(transformObjectToOption),
      referralSourceActivities: metadata.referralSourceActivityOptions.map(transformObjectToOption),
      referralSourceMarketing: metadata.referralSourceMarketingOptions.map(transformObjectToOption),
      referralSourceWebsite: metadata.referralSourceWebsiteOptions.map(transformObjectToOption),
      primarySectors: metadata.sectorOptions.map(transformObjectToOption),
      businessActivities: metadata.businessActivityOptions.map(transformObjectToOption),
    }

    if (res.locals.form.state) {
      // TODO: This is to support the leading question of whether current
      // user is the CRM or adviser - this journey will be changed in the
      // future but until then this supports the settings of that data
      if (investmentData.client_relationship_manager === req.session.user.id) {
        res.locals.form.state.is_relationship_manager = investmentData.client_relationship_manager
      } else {
        res.locals.form.state.is_relationship_manager = 'false'
      }

      if (investmentData.referral_source_adviser === req.session.user.id) {
        res.locals.form.state.is_referral_source = investmentData.referral_source_adviser
      } else {
        res.locals.form.state.is_referral_source = 'false'
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

function handleFormPost (req, res, next) {
  const formattedBody = transformToApi(Object.assign({}, req.body))
  const projectId = res.locals.projectId || req.params.id
  let saveMethod

  if (projectId) {
    saveMethod = updateInvestment(req.session.token, projectId, formattedBody)
  } else {
    saveMethod = createInvestmentProject(req.session.token, formattedBody)
  }

  saveMethod
    .then((result) => {
      res.locals.resultId = result.id
      next()
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.form = Object.assign({}, res.locals.form, {
          state: req.body,
          errors: {
            messages: err.error,
          },
        })
        next()
      } else {
        next(err)
      }
    })
}

function validateForm (req, res, next) {
  const errorMessages = get(res.locals, 'form.errors.messages')

  if (isEmpty(errorMessages)) {
    return next()
  }

  if (!req.body.is_relationship_manager) {
    errorMessages.is_relationship_manager = ['This field is required.']
    delete errorMessages.client_relationship_manager
  }

  if (!req.body.is_referral_source) {
    errorMessages.is_referral_source = ['This field is required.']
    delete errorMessages.referral_source_adviser
  }

  next()
}

module.exports = {
  populateForm,
  handleFormPost,
  validateForm,
}
