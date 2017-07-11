function renderInvestmentList (req, res) {
  res.render('investment-projects/views/list', {
    title: 'Investment Projects',
  })
}

module.exports = {
  renderInvestmentList,
}
