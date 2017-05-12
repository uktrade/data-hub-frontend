/* eslint new-cap: 0 */
const express = require('express')
const winston = require('winston')
const Q = require('q')
const companyRepository = require('../repos/company.repo')
const companyService = require('../services/company.service')
const router = express.Router()

function archiveCompany (req, res, next) {
  Q.spawn(function * () {
    try {
      const company = yield companyRepository.getDitCompany(req.session.token, req.params.id)
      const url = companyService.getViewCompanyLink(company)
      const reason = (req.body.archived_reason !== 'Other') ? req.body.archived_reason : req.body.archived_reason_other

      if (reason.length > 0) {
        yield companyRepository.archiveCompany(req.session.token, company.id, reason)
        req.flash('success-message', 'Updated company record')
      } else {
        req.flash('error-message', 'Unable to archive company, no reason given')
      }

      res.redirect(url)
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

function unarchiveCompany (req, res, next) {
  Q.spawn(function * () {
    try {
      const company = yield companyRepository.getDitCompany(req.session.token, req.params.id)
      const url = companyService.getViewCompanyLink(company)
      yield companyRepository.unarchiveCompany(req.session.token, company.id)
      req.flash('success-message', 'Updated company record')
      res.redirect(url)
    } catch (error) {
      winston.error(error)
      next(error)
    }
  })
}

router.post('/company/archive/:id', archiveCompany)
router.get('/company/unarchive/:id', unarchiveCompany)

module.exports = { router, archiveCompany, unarchiveCompany }
