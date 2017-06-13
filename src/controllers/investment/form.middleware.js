const Q = require('q')
const { get } = require('lodash')
const metadataRepo = require('../../repos/metadata.repo')
const { getAdvisers } = require('../../repos/adviser.repo')
const { isValidGuid } = require('../../lib/controller-utils')
const { transformToApi, transformFromApi } = require('../../services/investment-formatting.service')
const { valueLabels } = require('./labels')
const {
  createInvestmentProject,
  updateInvestmentProject,
  getEquityCompanyDetails,
  updateInvestmentValue,
} = require('../../repos/investment.repo')

function populateDetailsFormMiddleware (req, res, next) {
  const equityCompanyId = get(res, 'locals.equityCompany.id', req.query['equity-company'])

  if (!isValidGuid(equityCompanyId)) {
    return res.redirect('/investment/start')
  }

  Q.spawn(function * () {
    try {
      const advisersResponse = yield getAdvisers(req.session.token)
      const {
        equityCompany,
        equityCompanyInvestment,
      } = yield getEquityCompanyDetails(req.session.token, equityCompanyId)

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
  })
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

module.exports = {
  investmentDetailsFormPostMiddleware,
  investmentValueFormPostMiddleware,
  populateDetailsFormMiddleware,
  populateValueFormMiddleware,
}
