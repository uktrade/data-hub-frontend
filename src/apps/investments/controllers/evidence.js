async function renderEvidenceView(req, res) {
  return res
    .breadcrumb('Evidence')
    .render('investments/apps/evidence/views/list', {
      props: {
        projectId: res.locals.investment.id,
      },
    })
}

module.exports = {
  renderEvidenceView,
}
