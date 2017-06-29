function getHandler (req, res) {
  req.session.returnTo = null
  req.session.token = null
  req.session.user = null
  req.flash('success', 'You have been successfully signed out.')
  res.redirect('/sign-in')
}

module.exports = {
  getHandler,
}
