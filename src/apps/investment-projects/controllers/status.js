const { assign } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { statusFormConfig } = require('../macros')
const { updateInvestment } = require('../repos')

function renderStatusPage (req, res, next) {
  const status = req.body.status || res.locals.investmentData.status

  const statusForm = assign(
    buildFormWithStateAndErrors(statusFormConfig, { status }, res.locals.errors),
    { returnLink: `/investment-projects/${res.locals.investmentData.id}/details` },
  )

  res
    .breadcrumb('Change project status')
    .render('investment-projects/views/status', { statusForm })
}

async function postStatus (req, res, next) {
  try {
    await updateInvestment(req.session.token, req.params.investmentId, {
      status: req.body.status,
    })

    req.flash('success', 'Investment details updated')

    return res.redirect(`/investment-projects/${res.locals.investmentData.id}/details`)
  } catch (error) {
    if (error.statusCode === 400) {
      res.locals.errors = error.error
      return next()
    }
    next(error)
  }
}

module.exports = {
  renderStatusPage,
  postStatus,
}
