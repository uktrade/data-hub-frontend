function renderCreateProjectPage(req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investments/views/create/project')
}

module.exports = {
  renderCreateProjectPage,
}
