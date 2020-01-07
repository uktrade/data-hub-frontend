const { isEmpty } = require('lodash')

function getHandler(req, res, next) {
  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Client relationship management')
    .render('investments/views/team/edit-client-relationship-management')
}

function postHandler(req, res, next) {
  if (isEmpty(res.locals.form.errors)) {
    const { projects } = res.locals.paths
    const { id } = res.locals.investment

    req.flash('success', 'Investment details updated')
    return res.redirect(`${projects}/${id}/team`)
  }

  return next()
}

module.exports = {
  getHandler,
  postHandler,
}
