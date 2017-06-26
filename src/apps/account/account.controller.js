function getHandler (req, res) {
  res.render('account/views/account', {
    title: 'Your account',
  })
}

module.exports = {
  getHandler,
}
