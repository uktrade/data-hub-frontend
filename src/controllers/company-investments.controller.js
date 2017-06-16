const router = require('express').Router()
const Q = require('q')

const { getInflatedDitCompany, getCommonTitlesAndlinks } = require('../services/company.service')
const { getCompanyInvestmentProjects } = require('../repos/investment.repo')

function getAction (req, res, next) {
  const token = req.session.token
  const companyId = req.params.id

  Q.spawn(function * () {
    try {
      const company = yield getInflatedDitCompany(token, companyId)
      const projects = yield getCompanyInvestmentProjects(token, companyId)

      getCommonTitlesAndlinks(req, res, company)

      res.render('company/investments', {
        title: ['Investments', company.name, 'Companies'],
        tab: 'investments',
        company,
        projects,
      })
    } catch (error) {
      next(error)
    }
  })
}

router.get('/company/:id/investments', getAction)

module.exports = {
  getAction,
  router,
}
