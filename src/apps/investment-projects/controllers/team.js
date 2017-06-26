function getTeamHandler (req, res, next) {
  res.locals.title.unshift('Team')

  res.render('investment/team', {
    currentNavItem: 'team',
  })
}

module.exports = {
  getTeamHandler,
}
