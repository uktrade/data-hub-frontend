const { isEmpty } = require('lodash')

function getHandler (req, res, next) {
  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Team members')
    .render('investment-projects/views/team/edit-team-members')
}

function postHandler (req, res, next) {
  if (isEmpty(res.locals.form.errors)) {
    req.flash('success', 'Investment details updated')
    return res.redirect(`/investment-projects/${res.locals.investmentData.id}/team`)
  }

  return next()
}

module.exports = {
  getHandler,
  postHandler,
}
