const { get } = require('lodash')

const { transformToApi, transformFromApi } = require('../../services/formatting')
const { isValidGuid } = require('../../../../lib/controller-utils')
const metadataRepo = require('../../../../lib/metadata')
const { getAdvisers } = require('../../../adviser/repos')
const {
  createInvestmentProject,
  getEquityCompanyDetails,
  updateInvestment,
} = require('../../repos')

async function populateForm (req, res, next) {
  const equityCompanyId = get(res, 'locals.equityCompany.id', req.query['equity-company'])

  if (!isValidGuid(equityCompanyId)) {
    return res.redirect('/investment-projects/create')
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

    const investmentData = transformFromApi(res.locals.investmentData)

    res.locals.equityCompany = equityCompany
    res.locals.equityCompanyInvestment = equityCompanyInvestment
    res.locals.form = res.locals.form || {}
    res.locals.form.state = investmentData

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
      if (investmentData.client_relationship_manager === req.session.user.id) {
        res.locals.form.state['is-relationship-manager'] = investmentData.client_relationship_manager
      } else {
        res.locals.form.state['is-relationship-manager'] = 'No'
      }

      if (investmentData.referral_source_adviser === req.session.user.id) {
        res.locals.form.state['is-referral-source'] = investmentData.referral_source_adviser
      } else {
        res.locals.form.state['is-referral-source'] = 'No'
      }
    }

    next()
  } catch (error) {
    next(error)
  }
}

function handleFormPost (req, res, next) {
  const formattedBody = transformToApi(req.body)
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
  populateForm,
  handleFormPost,
}
