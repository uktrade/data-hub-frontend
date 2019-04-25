function renderCreateInvestorProfilePage (req, res) {
  return res
    .breadcrumb('Create a large capital investor profile')
    .render('investments/views/create/investor-profile')
}

module.exports = {
  renderCreateInvestorProfilePage,
}
