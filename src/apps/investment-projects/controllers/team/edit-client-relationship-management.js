const { isEmpty } = require('lodash')

function getHandler (req, res, next) {
  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Client relationship management')
    .render('investment-projects/views/team/edit-client-relationship-management')
}

function postHandler (req, res, next) {
  if (isEmpty(res.locals.form.errors)) {
    req.flash('success', 'Investment details updated')
    const { projects } = res.locals.paths
    return res.redirect(`${projects}/${res.locals.investment.id}/team`)
  }

  return next()
}

module.exports = {
  getHandler,
  postHandler,
}
