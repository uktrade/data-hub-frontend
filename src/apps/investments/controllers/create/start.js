function renderCreatePage(req, res) {
  const props = {
    company: res.locals.company,
  }

  return res
    .breadcrumb('Add investment project')
    .render('investments/views/create/start', { props })
}

module.exports = {
  renderCreatePage,
}
