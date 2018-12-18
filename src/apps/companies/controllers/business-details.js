/* eslint-disable camelcase */
const {
  transformCompanyToKnownAsView,
  transformCompanyToOneListView,
  transformCompanyToBusinessHierarchyView,
  transformCompanyToSectorView,
} = require('../transformers')
const {
  getCompanySubsidiaries,
} = require('../repos')

async function renderBusinessDetails (req, res) {
  const company = res.locals.company
  const subsidiaries = await getCompanySubsidiaries(req.session.token, company.id)

  res
    .breadcrumb(company.name, `/companies/${company.id}`)
    .breadcrumb('Business details')
    .render('companies/views/business-details', {
      heading: 'Business details',
      knownAsDetails: transformCompanyToKnownAsView(company),
      oneListDetails: transformCompanyToOneListView(company),
      businessHierarchyDetails: transformCompanyToBusinessHierarchyView(company, subsidiaries.count),
      sectorDetails: transformCompanyToSectorView(company),
    })
}

module.exports = {
  renderBusinessDetails,
}
