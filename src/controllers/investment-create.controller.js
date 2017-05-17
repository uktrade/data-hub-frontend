const router = require('express').Router()

const { getInflatedDitCompany } = require('../services/company.service')
const { getCompanyInvestmentProjects } = require('../repos/investment.repo')

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
      res.render('investment/create', {
        equityCompany,
        equityCompanyInvestments
      })
    })
    .catch(next)
}

router.get('/investment/create', getHandler)

module.exports = { router, getHandler }
