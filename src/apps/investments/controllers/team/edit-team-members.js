function renderTeamEdit(req, res) {
  const { investmentId } = req.params
  const teamMembers = res.locals.investment.team_members || []
  res
    .breadcrumb('Project team', 'team')
    .breadcrumb('Team members')
    .render('investments/views/team/edit-team-members', {
      props: {
        id: investmentId,
        teamMembers,
      },
    })
}
module.exports = {
  renderTeamEdit,
}
