function renderInvestmentInfoPage(req, res) {
  return res
    .breadcrumb('Add investment project')
    .render('investments/views/create/info')
}

module.exports = {
  renderInvestmentInfoPage,
}
