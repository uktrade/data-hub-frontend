function getHandler (req, res) {
  req.session.returnTo = null
  req.session.token = null
  req.session.user = null
  req.flash('success-message', 'Signed out')
  res.redirect('/login')
}

module.exports = {
  getHandler,
}
