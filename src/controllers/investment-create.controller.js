const router = require('express').Router()

const { getInflatedDitCompany } = require('../services/company.service')
const {
  getCompanyInvestmentProjects,
  getInvestmentProjectSummary,
  createInvestmentProject,
  updateInvestmentProject,
} = require('../repos/investment.repo')
const { transformToApi, transformFromApi } = require('../services/investment-formatting.service')
const { getAdvisers } = require('../repos/adviser.repo')
const metadataRepo = require('../repos/metadata.repo')

function getHandler (req, res, next) {
  const equityCompanyId = res.locals.equityCompanyId || req.query['equity-company']
  const promises = [
    getInflatedDitCompany(req.session.token, equityCompanyId),
    getCompanyInvestmentProjects(req.session.token, equityCompanyId),
    getAdvisers(req.session.token),
  ]

  if (!equityCompanyId) {
    res.redirect('/investment/start')
  }

  Promise.all(promises)
    .then(([equityCompany, equityCompanyInvestments, adviserResponse]) => {
      const form = res.locals.form || {}
      const contacts = equityCompany.contacts.map((contact) => {
        return {
          id: contact.id,
          name: `${contact.first_name} ${contact.last_name}`,
        }
      })
      const investmentTypes = metadataRepo.investmentTypeOptions.map((type) => {
        return {
          value: type.id,
          label: type.name,
        }
      })
      const advisers = adviserResponse.results.map((adviser) => {
        return {
          id: adviser.id,
          name: `${adviser.first_name} ${adviser.last_name}`,
        }
      })

      form.options = {
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

      res.render('investment/create', {
        equityCompany,
        equityCompanyInvestments,
        form,
      })
    })
    .catch(next)
}

function postHandler (req, res, next) {
  const formattedBody = transformToApi(req.body)
  const projectId = res.locals.projectId
  let saveMethod

  if (projectId) {
    saveMethod = updateInvestmentProject(req.session.token, projectId, formattedBody)
  } else {
    saveMethod = createInvestmentProject(req.session.token, formattedBody)
  }

  saveMethod
    .then((result) => {
      res.redirect(`/investment/${result.id}`)
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.locals.form = res.locals.form || {}

        res.locals.form.errors = err.error
        res.locals.form.state = req.body

        next()
      } else {
        next(err)
      }
    })
}

function editMiddleware (req, res, next) {
  getInvestmentProjectSummary(req.session.token, req.params.id)
    .then((response) => {
      const projectData = transformFromApi(response)

      res.locals.form = res.locals.form || {}
      res.locals.form.state = projectData
      res.locals.equityCompanyId = projectData.investor_company
      res.locals.projectId = projectData.id

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

      next()
    })
    .catch(next)
}

router.get('/investment/create', getHandler)
router.post('/investment/create', postHandler, getHandler)

router.get('/investment/:id/details/edit', editMiddleware, getHandler)
router.post('/investment/:id/details/edit', editMiddleware, postHandler, getHandler)

module.exports = {
  router,
  getHandler,
  postHandler,
  editMiddleware,
}
