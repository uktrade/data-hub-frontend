function renderTeamEdit(req, res, next) {
  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Team members')
    .render('investments/views/team/edit-team-members')
}

module.exports = {
  renderTeamEdit,
}
