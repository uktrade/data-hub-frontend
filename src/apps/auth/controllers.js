const { signInForm } = require('./macros')

function renderSignInPage (req, res) {
  if (req.session.user) {
    return res.redirect('/')
  }

  res
    .title('Sign in')
    .render('auth/view', {
      signInForm: Object.assign({}, signInForm, res.locals.signInForm),
    })
}

function signOut (req, res) {
  req.session.returnTo = null
  req.session.token = null
  req.session.user = null
  req.flash('success', 'You have been successfully signed out.')
  res.redirect('/sign-in')
}

module.exports = {
  renderSignInPage,
  signOut,
}
