const { assign, flatten, get, isEmpty } = require('lodash')

const { transformToApi, transformFromApi } = require('../../services/formatting')
const { isValidGuid } = require('../../../../lib/controller-utils')
const metadata = require('../../../../lib/metadata')
const { getAdvisers } = require('../../../adviser/repos')
const {
  buildMetaDataObj,
  transformObjectToOption,
  transformContactToOption,
} = require('../../../transformers')
const { filterDisabledOption } = require('../../../filters')
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
    const advisersResponse = await getAdvisers({ token: req.session.token })
    const {
      equityCompany,
      equityCompanyInvestment,
    } = await getEquityCompanyDetails(req.session.token, equityCompanyId)

    const contacts = equityCompany.contacts.map(transformContactToOption)
    const advisers = advisersResponse.map(transformObjectToOption)
    const investmentData = transformFromApi(res.locals.investmentData)
    const investmentTypes = metadata.investmentTypeOptions.map(transformObjectToOption).filter((investmentType) => {
      return equityCompany.uk_based || investmentType.label.toLowerCase().includes('fdi')
    })
    const referralSourceActivities = metadata.referralSourceActivityOptions.map(transformObjectToOption)

    const state = assign({}, {
      client_contacts: [''],
      business_activities: [''],
    }, investmentData)

    res.locals.clientCompanyId = clientCompanyId || equityCompanyId
    res.locals.equityCompany = equityCompany
    res.locals.equityCompanyInvestment = equityCompanyInvestment

    res.locals.form = assign({}, res.locals.form, {
      state,
      options: {
        advisers,
        contacts,
        investmentTypes,
        referralSourceActivities,
        investmentTypesObj: buildMetaDataObj(investmentTypes),
        fdi: metadata.fdiOptions.map(transformObjectToOption),
        referralSourceActivitiesObj: buildMetaDataObj(referralSourceActivities),
        referralSourceMarketing: metadata.referralSourceMarketingOptions.map(transformObjectToOption),
        referralSourceWebsite: metadata.referralSourceWebsiteOptions.map(transformObjectToOption),
        primarySectors: metadata.sectorOptions.map(transformObjectToOption),
        businessActivities: metadata.businessActivityOptions.map(transformObjectToOption),
        investmentSpecificProgramme: metadata.investmentSpecificProgrammeOptions
          .map(transformObjectToOption)
          .filter(filterDisabledOption(state.specific_programme)),
        investmentInvestorType: metadata.investmentInvestorTypeOptions
          .map(transformObjectToOption)
          .filter(filterDisabledOption(state.investor_type)),
        investmentInvolvement: metadata.investmentInvolvementOptions
          .map(transformObjectToOption)
          .filter(filterDisabledOption(state.level_of_involvement)),
      },
    })

    if (investmentData) {
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
  const projectId = res.locals.projectId || req.params.investmentId
  const addKey = req.body['add-item']
  let saveMethod

  // Todo - currently only supports add with non-js,
  // add remove action for non-js later, for now the user just sets the value to nothing.
  if (addKey) {
    req.body[addKey] = flatten([req.body[addKey]])
    req.body[addKey].push('')

    res.locals.form = assign({}, res.locals.form, {
      state: req.body,
    })

    return next()
  }

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
        const state = assign({}, req.body, {
          client_contacts: flatten([req.body.client_contacts]),
          business_activities: flatten([req.body.business_activities]),
        })

        res.locals.form = assign({}, res.locals.form, {
          state,
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
