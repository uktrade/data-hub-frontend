function get (req, res) {
  res.render('support/thank', {
    title: ['Thank you', 'Support'],
  })
}

module.exports = {
  get,
}
