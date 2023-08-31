function renderRequirementsForm(req, res) {
  const { investment } = res.locals
  res
    .breadcrumb('Edit requirements')
    .render('investments/views/requirements-edit', {
      props: {
        projectId: investment.id,
      },
    })
}

function renderValueForm(req, res) {
  const { investment } = res.locals
  res.breadcrumb('Edit value').render('investments/views/value-edit', {
    props: {
      projectId: investment.id,
    },
  })
}

module.exports = {
  renderRequirementsForm,
  renderValueForm,
}
