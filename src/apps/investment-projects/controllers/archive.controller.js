const { get } = require('lodash')

const investmentRepository = require('../investment-projects.repo')

async function archiveInvestmentProjectHandler (req, res, next) {
  try {
    // Archive the project.
    const reason = (req.body.archived_reason === 'Other') ? req.body.archived_reason_other : req.body.archived_reason
    await investmentRepository.archiveInvestmentProject(req.session.token, req.params.id, reason)

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
}

async function unarchiveInvestmentProjectHandler (req, res, next) {
  try {
    await investmentRepository.unarchiveInvestmentProject(req.session.token, req.params.id)
    req.flash('success-message', 'Updated investment project')
    res.redirect(`/investment/${req.params.id}/details`)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  archiveInvestmentProjectHandler,
  unarchiveInvestmentProjectHandler,
}
