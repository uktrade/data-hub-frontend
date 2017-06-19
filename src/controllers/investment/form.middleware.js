const { get, flatten } = require('lodash')
const metadataRepo = require('../../repos/metadata.repo')
const { getAdvisers } = require('../../repos/adviser.repo')
const { isValidGuid } = require('../../lib/controller-utils')
const { transformToApi, transformFromApi } = require('../../services/investment-formatting.service')
const interactionFormattingService = require('../../services/interaction-formatting.service')
const {
  valueLabels,
  interactionsLabels,
  requirementsLabels,
} = require('./labels')
const {
  createInvestmentInteraction,
  updateInvestmentInteraction,
} = require('../../repos/interaction.repo')
const {
  createInvestmentProject,
  getEquityCompanyDetails,
  updateInvestmentProject,
  updateInvestmentValue,
  updateInvestmentRequirements,
} = require('../../repos/investment.repo')

async function populateDetailsFormMiddleware (req, res, next) {
  const equityCompanyId = get(res, 'locals.equityCompany.id', req.query['equity-company'])

  if (!isValidGuid(equityCompanyId)) {
    return res.redirect('/investment/start')
  }

  try {
    const advisersResponse = await getAdvisers(req.session.token)
    const {
      equityCompany,
      equityCompanyInvestment,
    } = await getEquityCompanyDetails(req.session.token, equityCompanyId)

    const contacts = equityCompany.contacts.map((contact) => {
      return {
        id: contact.id,
        name: `${contact.first_name} ${contact.last_name}`,
      }
    })

    const advisers = advisersResponse.results.map((adviser) => {
      return {
        id: adviser.id,
        name: `${adviser.first_name} ${adviser.last_name}`,
      }
    })

    const investmentTypes = metadataRepo.investmentTypeOptions.map((type) => {
      return {
        value: type.id,
        label: type.name,
      }
    })

    const projectData = transformFromApi(res.locals.projectData)

    res.locals.equityCompany = equityCompany
    res.locals.equityCompanyInvestment = equityCompanyInvestment
    res.locals.form = res.locals.form || {}
    res.locals.form.state = projectData

    res.locals.form.options = {
      advisers,
      contacts,
      investmentTypes,
      fdi: metadataRepo.fdiOptions,
      nonFdi: metadataRepo.nonFdiOptions,
      referralSourceActivities: metadataRepo.referralSourceActivityOptions,
      referralSourceMarketing: metadataRepo.referralSourceMarketingOptions,
      referralSourceWebsite: metadataRepo.referralSourceWebsiteOptions,
      primarySectors: metadataRepo.sectorOptions,
      businessActivities: metadataRepo.businessActivityOptions,
    }

    if (res.locals.form.state) {
      // TODO: This is to support the leading question of whether current
      // user is the CRM or adviser - this journey will be changed in the
      // future but until then this supports the settings of that data
      if (projectData.client_relationship_manager === req.session.user.id) {
        res.locals.form.state['is-relationship-manager'] = projectData.client_relationship_manager
      } else {
        res.locals.form.state['is-relationship-manager'] = 'No'
      }

      if (projectData.referral_source_adviser === req.session.user.id) {
        res.locals.form.state['is-referral-source'] = projectData.referral_source_adviser
      } else {
        res.locals.form.state['is-referral-source'] = 'No'
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

function populateValueFormMiddleware (req, res, next) {
  res.locals.form = get(res, 'locals.form', {})
  res.locals.form.labels = valueLabels.edit
  res.locals.form.state = Object.assign({}, res.locals.valueData, {
    average_salary: get(res.locals.valueData, 'average_salary.id'),
  })
  res.locals.form.options = {
    averageSalaryRange: metadataRepo.salaryRangeOptions,
  }

  next()
}

function populateRequirementsFormMiddleware (req, res, next) {
  res.locals.form = get(res, 'locals.form', {})
  res.locals.form.labels = requirementsLabels.edit
  res.locals.form.state = res.locals.requirementsData

  res.locals.form.options = {
    countryOptions: metadataRepo.countryOptions,
    regionOptions: metadataRepo.regionOptions,
    strategicDriverOptions: metadataRepo.strategicDriverOptions,
  }

  next()
}

function investmentDetailsFormPostMiddleware (req, res, next) {
  const formattedBody = transformToApi(req.body)
  const projectId = res.locals.projectId || req.params.id
  let saveMethod

  if (projectId) {
    saveMethod = updateInvestmentProject(req.session.token, projectId, formattedBody)
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
        res.locals.form = get(res, 'locals.form', {})
        res.locals.form.errors = err.error
        res.locals.form.state = req.body

        next()
      } else {
        next(err)
      }
    })
}

function investmentValueFormPostMiddleware (req, res, next) {
  res.locals.projectId = req.params.id

  const formattedBody = Object.assign({}, req.body, {
    average_salary: {
      id: req.body.average_salary,
    },
    client_cannot_provide_total_investment: req.body.client_cannot_provide_total_investment === 'on',
    client_cannot_provide_foreign_investment: req.body.client_cannot_provide_foreign_investment === 'on',
  })

  updateInvestmentValue(req.session.token, res.locals.projectId, formattedBody)
    .then(() => next())
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.form = get(res, 'locals.form', {})
        res.locals.form.errors = err.error
        res.locals.form.state = req.body

        next()
      } else {
        next(err)
      }
    })
}

async function populateInteractionsFormMiddleware (req, res, next) {
  try {
    const interactionTypes = metadataRepo.interactionTypeOptions
    const advisersResponse = await getAdvisers(req.session.token)
    const contacts = res.locals.projectData.client_contacts

    const advisers = advisersResponse.results.map((adviser) => {
      return {
        id: adviser.id,
        name: `${adviser.first_name} ${adviser.last_name}`,
      }
    })

    res.locals.form = get(res, 'locals.form', {})
    res.locals.form.labels = interactionsLabels.edit
    res.locals.form.state = res.locals.interaction
    res.locals.form.options = {
      advisers,
      contacts,
      interactionTypes,
    }

    next()
  } catch (error) {
    next(error)
  }
}

function interactionDetailsFormPostMiddleware (req, res, next) {
  const formattedBody = interactionFormattingService.transformToApi(req.body)
  const interactionId = req.params.interactionId
  let saveMethod

  if (interactionId) {
    saveMethod = updateInvestmentInteraction(req.session.token, interactionId, formattedBody)
  } else {
    saveMethod = createInvestmentInteraction(req.session.token, formattedBody)
  }

  saveMethod
    .then((result) => {
      res.locals.resultId = result.id
      next()
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.form = get(res, 'locals.form', {})
        res.locals.form.errors = err.error
        res.locals.form.state = req.body

        next()
      } else {
        next(err)
      }
    })
}

function investmentRequirementsFormPostMiddleware (req, res, next) {
  res.locals.projectId = req.params.id

  const formattedBody = Object.assign({}, req.body, {
    strategic_drivers: flatten([req.body.strategic_drivers]),
    competitor_countries: flatten([req.body.competitor_countries]),
    uk_region_locations: flatten([req.body.uk_region_locations]),
  })

  updateInvestmentRequirements(req.session.token, res.locals.projectId, formattedBody)
  .then(() => next())
  .catch((err) => {
    if (err.statusCode === 400) {
      res.locals.form = get(res, 'locals.form', {})
      res.locals.form.errors = err.error
      res.locals.form.state = req.body

      next()
    } else {
      next(err)
    }
  })
}

module.exports = {
  investmentDetailsFormPostMiddleware,
  investmentValueFormPostMiddleware,
  investmentRequirementsFormPostMiddleware,
  populateDetailsFormMiddleware,
  populateValueFormMiddleware,
  interactionDetailsFormPostMiddleware,
  populateInteractionsFormMiddleware,
  populateRequirementsFormMiddleware,
}
