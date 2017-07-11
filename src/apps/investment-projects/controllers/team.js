function getTeamHandler (req, res, next) {
  res
    .breadcrumb('Project team')
    .render('investment-projects/views/team', {
      currentNavItem: 'team',
    })
}

module.exports = {
  getTeamHandler,
}
