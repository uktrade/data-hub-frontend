function renderInteractions (req, res, next) {
  try {
    res
      .breadcrumb('Interactions')
      .render('contacts/views/interactions')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractions,
}
