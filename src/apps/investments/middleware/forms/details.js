const { assign, flatten, get, isEmpty } = require('lodash')

const { transformToApi, transformFromApi } = require('../../transformers')
const { isValidGuid } = require('../../../../lib/controller-utils')
const { getAdvisers } = require('../../../adviser/repos')
const { filterActiveAdvisers } = require('../../../adviser/filters')
const { getOptions } = require('../../../../lib/options')
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

async function populateForm(req, res, next) {
  const clientCompanyId = req.query['client-company']
  const equityCompanyId = get(
    res,
    'locals.equityCompany.id',
    req.params.equityCompanyId
  )
  const { projects } = res.locals.paths

  if (!isValidGuid(equityCompanyId)) {
    return res.redirect(`${projects}/create`)
  }

  try {
    const investment = transformFromApi(res.locals.investment)
    const createdOn = get(investment, 'created_on')

    const {
      equityCompany,
      equityCompanyInvestment,
    } = await getEquityCompanyDetails(req, equityCompanyId)

    const contacts = get(equityCompany, 'contacts', []).map(
      transformContactToOption
    )

    const investmentTypes = await getOptions(req, 'investment-type', {
      createdOn,
    })
    const referralSourceActivities = await getOptions(
      req,
      'referral-source-activity',
      { createdOn }
    )

    const state = assign(
      {},
      {
        client_contacts: [''],
        business_activities: [''],
      },
      investment
    )

    const advisersResponse = await getAdvisers(req)

    const clientRelationshipManagers = filterActiveAdvisers({
      advisers: advisersResponse.results,
      includeAdviser: get(investment, 'client_relationship_manager'),
    }).map(transformObjectToOption)

    const referralSourceAdvisers = filterActiveAdvisers({
      advisers: advisersResponse.results,
      includeAdviser: get(investment, 'referral_source_adviser'),
    }).map(transformObjectToOption)

    res.locals.clientCompanyId = clientCompanyId || equityCompanyId
    res.locals.equityCompany = equityCompany
    res.locals.equityCompanyInvestment = equityCompanyInvestment

    res.locals.form = assign({}, res.locals.form, {
      state,
      options: {
        clientRelationshipManagers,
        referralSourceAdvisers,
        contacts,
        investmentTypes,
        referralSourceActivities,
        investmentTypesObj: buildMetaDataObj(investmentTypes),
        fdi: await getOptions(req, 'fdi-type', { createdOn }),
        referralSourceActivitiesObj: buildMetaDataObj(referralSourceActivities),
        referralSourceMarketing: await getOptions(
          req,
          'referral-source-marketing',
          { createdOn }
        ),
        referralSourceWebsite: await getOptions(
          req,
          'referral-source-website',
          { createdOn }
        ),
        primarySectors: await getOptions(req, 'sector', { createdOn }),
        businessActivities: await getOptions(
          req,
          'investment-business-activity',
          { createdOn }
        ),
        investmentSpecificProgramme: await getOptions(
          req,
          'investment-specific-programme',
          { createdOn }
        ),
        investmentInvestorType: await getOptions(
          req,
          'investment-investor-type',
          { createdOn }
        ),
        investmentInvolvement: await getOptions(req, 'investment-involvement', {
          createdOn,
        }),
      },
    })

    if (investment) {
      // TODO: This is to support the leading question of whether current
      // user is the CRM or adviser - this journey will be changed in the
      // future but until then this supports the settings of that data
      if (investment.client_relationship_manager === req.session.user.id) {
        res.locals.form.state.is_relationship_manager =
          investment.client_relationship_manager
      } else {
        res.locals.form.state.is_relationship_manager = 'false'
      }

      if (investment.referral_source_adviser === req.session.user.id) {
        res.locals.form.state.is_referral_source =
          investment.referral_source_adviser
      } else {
        res.locals.form.state.is_referral_source = 'false'
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

function handleFormPost(req, res, next) {
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
    saveMethod = updateInvestment(req, projectId, formattedBody)
  } else {
    saveMethod = createInvestmentProject(req, formattedBody)
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

function validateForm(req, res, next) {
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
