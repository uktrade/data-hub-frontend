function editRedirect (req, res) {
  res.redirect(`/omis/${res.locals.order.id}`)
}

module.exports = editRedirect
