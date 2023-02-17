function renderOverview(req, res) {
  res.render('companies/apps/company-overview/views/overview', {
    props: {
      hello: 'world',
    },
  })
}

module.exports = {
  renderOverview,
}
