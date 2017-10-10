function renderInteractionList (req, res, next) {
  try {
    res
      .breadcrumb('Interactions')
      .render('investment-projects/views/interactions')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
}
