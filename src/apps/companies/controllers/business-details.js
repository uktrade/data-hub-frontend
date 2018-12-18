/* eslint-disable camelcase */
const {
  transformCompanyToKnownAsView,
} = require('../transformers')

async function renderBusinessDetails (req, res) {
  const company = res.locals.company

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Business details')
    .render('companies/views/business-details', {
      heading: 'Business details',
      knownAsDetails: transformCompanyToKnownAsView(company),
    })
}

module.exports = {
  renderBusinessDetails,
}
