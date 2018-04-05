const { search } = require('../../search/services')
const { transformApiResponseToSearchCollection } = require('../../search/transformers')
const { transformCompanyToSubsidiaryListItem } = require('../transformers')
const { companyDetailsLabels } = require('../labels')

async function renderSubsidiaries (req, res, next) {
  const token = req.session.token
  const query = req.query
  const page = query.page || '1'

  const {
    id: companyId,
    name: companyName,
  } = res.locals.company

  const companies = await search({
    token,
    page,
    searchEntity: 'company',
    requestBody: { global_headquarters: companyId },
    isAggregation: false,
  })
    .then(transformApiResponseToSearchCollection(
      { query },
      transformCompanyToSubsidiaryListItem,
    ))

  res
    .breadcrumb(companyName, `/companies/${companyId}`)
    .breadcrumb(companyDetailsLabels.subsidiaries)
    .render('companies/views/subsidiaries.njk', {
      companies,
      actionButtons: [{
        label: companyDetailsLabels.link_a_subsidiary,
        url: `/companies/${companyId}/subsidiaries/link`,
      }],
    })
}

module.exports = {
  renderSubsidiaries,
}
