const { isEmpty } = require('lodash')
const config = require('../../../../config')
const urls = require('../../../../lib/urls')

function getHandler(req, res) {
  const {
    id,
    client_relationship_manager,
    investor_company: { one_list_group_global_account_manager },
  } = res.locals.investment
  res
    .breadcrumb({
      text: 'Project team',
      href: urls.investments.projects.team(id),
    })
    .breadcrumb('Client relationship management')
  res.render('investments/views/team/edit-client-relationship-management', {
    props: {
      id,
      clientRelationshipManager: client_relationship_manager,
      globalAccountManager: one_list_group_global_account_manager,
      oneListEmail: config.oneList.email,
    },
  })
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
