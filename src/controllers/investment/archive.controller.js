/* eslint new-cap: 0 */
const express = require('express')
const Q = require('q')
const { get } = require('lodash')
const { getProjectDetails } = require('./shared.middleware')
const investmentRepository = require('../../repos/investment.repo')
const { detailsGetHandler } = require('./details.controller')

const router = express.Router()

function archiveInvestmentProjectHandler (req, res, next) {
  Q.spawn(function * () {
    try {
      // Archive the project.
      const reason = (req.body.archived_reason === 'Other') ? req.body.archived_reason_other : req.body.archived_reason
      yield investmentRepository.archiveInvestmentProject(req.session.token, req.params.id, reason)

      res.locals.projectData = Object.assign({}, res.locals.projectData, {
        archived: true,
        archived_reason: reason,
        archived_by: req.session.user,
        archived_on: new Date(),
      })
      next()
    } catch (err) {
      if (err.statusCode === 400) {
        res.locals.form = get(res, 'locals.form', {})
        res.locals.form.errors = err.error
        res.locals.form.state = req.body
        next()
      } else {
        next(err)
      }
    }
  })
}

function unarchiveInvestmentProjectHandler (req, res, next) {
  Q.spawn(function * () {
    try {
      yield investmentRepository.unarchiveInvestmentProject(req.session.token, req.params.id)
      req.flash('success-message', 'Updated investment project')
      res.redirect(`/investment/${req.params.id}/details`)
    } catch (error) {
      next(error)
    }
  })
}

router.param('id', getProjectDetails)
router.post('/:id/details', archiveInvestmentProjectHandler, detailsGetHandler)
router.get('/:id/unarchive', unarchiveInvestmentProjectHandler)

module.exports = { router, archiveInvestmentProjectHandler, unarchiveInvestmentProjectHandler }
