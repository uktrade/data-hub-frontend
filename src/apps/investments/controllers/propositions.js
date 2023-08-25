async function renderPropositionList(req, res) {
  return res
    .breadcrumb('Propositions')
    .render('investments/views/propositions', {
      props: {
        projectId: res.locals.investment.id,
      },
    })
}

module.exports = {
  renderPropositionList,
}
