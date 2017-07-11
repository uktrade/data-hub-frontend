function getDetailsHandler (req, res, next) {
  res.render('investment-projects/views/team/details', {
    currentNavItem: 'team',
  })
}

module.exports = {
  getDetailsHandler,
}
