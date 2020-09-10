const { assign } = require('lodash')

const { buildFormWithStateAndErrors } = require('../../builders')
const { statusFormConfig } = require('../macros')
const { updateInvestment } = require('../repos')

function renderStatusPage(req, res) {
  const status = req.body.status || res.locals.investment.status

  const { projects } = res.locals.paths
  const { id } = res.locals.investment

  const statusForm = assign(
    buildFormWithStateAndErrors(
      statusFormConfig,
      { status },
      res.locals.errors
    ),
    { returnLink: `${projects}/${id}/details` }
  )

  res
    .breadcrumb('Change project status')
    .render('investments/views/status', { statusForm })
}

async function postStatus(req, res, next) {
  try {
    await updateInvestment(req, req.params.investmentId, {
      status: req.body.status,
    })

    const { projects } = res.locals.paths
    const { id } = res.locals.investment

    req.flash('success', 'Investment details updated')
    return res.redirect(`${projects}/${id}/details`)
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
