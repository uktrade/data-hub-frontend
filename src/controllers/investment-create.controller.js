const router = require('express').Router()

const { getInflatedDitCompany } = require('../services/company.service')
const { getCompanyInvestmentProjects, saveInvestmentProject } = require('../repos/investment.repo')
const { transformForApi } = require('../services/investment-formatting.service')
const metadataRepo = require('../repos/metadata.repo')

function getHandler (req, res, next) {
  const equityCompanyId = req.query['equity-company']
  const promises = [
    getInflatedDitCompany(req.session.token, equityCompanyId),
    // TODO: remove this when the company endpoint returns a list of invesments
    getCompanyInvestmentProjects(req.session.token, equityCompanyId)
  ]

  if (!equityCompanyId) {
    return res.redirect('/investment/start')
  }

  Promise.all(promises)
    .then(([equityCompany, equityCompanyInvestments]) => {
      const contacts = equityCompany.contacts.map((contact) => {
        return {
          id: contact.id,
          name: `${contact.first_name} ${contact.last_name}`
        }
      })
      const investmentTypes = metadataRepo.investmentTypeOptions.map((type) => {
        return {
          value: type.id,
          label: type.name
        }
      })
      const form = res.locals.form || {}

      form.options = {
        contacts,
        investmentTypes,
        referralSourceActivities: metadataRepo.referralSourceActivityOptions,
        primarySectors: metadataRepo.sectorOptions,
        businessActivities: metadataRepo.businessActivityOptions
      }

      res.render('investment/create', {
        equityCompany,
        equityCompanyInvestments,
        form
      })
    })
    .catch(next)
}

function postHandler (req, res, next) {
  const formattedProject = transformForApi(req.body)

  saveInvestmentProject(req.session.token, formattedProject)
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

router.get('/investment/create', getHandler)
router.post('/investment/create', postHandler, getHandler)

module.exports = { router, getHandler, postHandler }
