async function renderPropositionList (req, res, next) {
  try {
    res.render('_layouts/collection', {
      title: 'Propositions',
      countLabel: 'proposition',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderPropositionList,
}
