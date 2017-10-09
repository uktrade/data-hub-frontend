function renderInteractionList (req, res, next) {
  try {
    res.render('interactions/views/list', {
      title: 'Interactions',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderInteractionList,
}
