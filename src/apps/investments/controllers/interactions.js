function renderInteractionsForEntity(req, res) {
  return res
    .breadcrumb('Interactions')
    .render('investments/views/interactions', {
      props: {
        projectId: res.locals.investment.id,
      },
    })
}

module.exports = {
  renderInteractionsForEntity,
}
