/* eslint new-cap: 0 */
const express = require('express')
const companyRepository = require('../repos/company.repo')
const companyService = require('../services/company.service')
const router = express.Router()

async function archiveCompany (req, res, next) {
  try {
    const company = await companyRepository.getDitCompany(req.session.token, req.params.id)
    const url = companyService.buildCompanyUrl(company)
    const reason = (req.body.archived_reason !== 'Other') ? req.body.archived_reason : req.body.archived_reason_other

    if (reason.length > 0) {
      await companyRepository.archiveCompany(req.session.token, company.id, reason)
      req.flash('success-message', 'Updated company record')
    } else {
      req.flash('error-message', 'Unable to archive company, no reason given')
    }

    res.redirect(url)
  } catch (error) {
    next(error)
  }
}

async function unarchiveCompany (req, res, next) {
  try {
    const company = await companyRepository.getDitCompany(req.session.token, req.params.id)
    const url = companyService.buildCompanyUrl(company)
    await companyRepository.unarchiveCompany(req.session.token, company.id)
    req.flash('success-message', 'Updated company record')
    res.redirect(url)
  } catch (error) {
    next(error)
  }
}

router.post('/company/archive/:id', archiveCompany)
router.get('/company/unarchive/:id', unarchiveCompany)

module.exports = { router, archiveCompany, unarchiveCompany }
