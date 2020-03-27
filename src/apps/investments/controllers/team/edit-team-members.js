function renderTeamEdit(req, res) {
  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Team members')
    .render('investments/views/team/edit-team-members')
}

module.exports = {
  renderTeamEdit,
}
