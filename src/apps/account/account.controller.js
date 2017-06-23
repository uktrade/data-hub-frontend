function getHandler (req, res) {
  res.render('myaccount/index', {
    title: 'Your account',
  })
}

module.exports = {
  getHandler,
}
