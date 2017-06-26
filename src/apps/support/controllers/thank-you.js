function get (req, res) {
  res.render('support/views/thank-you', {
    title: ['Thank you', 'Support'],
  })
}

module.exports = {
  get,
}
