const { transformApiResponseToSearchCollection } = require('../../../modules/search/transformers')
const { transformCompanyToSubsidiaryListItem } = require('../transformers')
const { getCompanySubsidiaries } = require('../repos')
const { companyDetailsLabels } = require('../labels')
const { ENTITIES } = require('../../search/constants')

async function renderSubsidiaries (req, res, next) {
  try {
    const token = req.session.token
    const { company, features } = res.locals
    const view = (company.duns_number || features['companies-new-layout'])
      ? 'companies/views/subsidiaries'
      : 'companies/views/_deprecated/subsidiaries'
    const actionButtons = company.archived || company.duns_number ? undefined : [{
      label: companyDetailsLabels.link_a_subsidiary,
      url: `/companies/${company.id}/subsidiaries/link`,
    }]

    const subsidiaryCollection = await getCompanySubsidiaries(token, company.id, req.query.page)
      .then(transformApiResponseToSearchCollection(
        { query: req.query },
        ENTITIES,
        transformCompanyToSubsidiaryListItem(res.locals.company),
      ))

    res.breadcrumb(company.name, `/companies/${company.id}`)

    if (features['companies-new-layout']) {
      res.breadcrumb('Business details', `/companies/${company.id}/business-details`)
    }

    return res
      .breadcrumb(companyDetailsLabels.subsidiaries)
      .render(view, {
        heading: `Subsidiaries of ${company.name}`,
        subsidiaries: {
          ...subsidiaryCollection,
          actionButtons,
          countLabel: 'subsidiary',
        },
        company,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderSubsidiaries,
}
