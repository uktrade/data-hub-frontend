function renderEvaluationPage(req, res) {
  return res.breadcrumb('Evaluation').render('investments/views/evaluation', {
    props: {
      projectId: res.locals.investment.id,
    },
  })
}
module.exports = {
  renderEvaluationPage,
}
