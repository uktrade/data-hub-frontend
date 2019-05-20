const { get } = require('lodash')

function renderCreateInvestorProfilePage (req, res) {
  const errors = get(res.locals, 'errors')
  return res
    .breadcrumb('Create a large capital investor profile')
    .render('investments/views/create/investor-profile', {
      errors,
    })
}

module.exports = {
  renderCreateInvestorProfilePage,
}
