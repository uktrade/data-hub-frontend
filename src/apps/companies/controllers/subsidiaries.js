const { transformApiResponseToSearchCollection } = require('../../../modules/search/transformers')
const { transformCompanyToSubsidiaryListItem } = require('../transformers')
const { getCompanySubsidiaries } = require('../repos')
const { companyDetailsLabels } = require('../labels')
const { ENTITIES } = require('../../search/constants')

async function renderSubsidiaries (req, res, next) {
  try {
    const token = req.session.token
    const query = req.query
    const page = query.page || '1'
    const { company } = res.locals
    const view = company.duns_number ? 'companies/views/subsidiaries' : 'companies/views/_deprecated/subsidiaries'
    const actionButtons = company.archived || company.duns_number ? undefined : [{
      label: companyDetailsLabels.link_a_subsidiary,
      url: `/companies/${company.id}/subsidiaries/link`,
    }]

    const subsidiaryCollection = await getCompanySubsidiaries(token, company.id, page)
      .then(transformApiResponseToSearchCollection(
        { query },
        ENTITIES,
        transformCompanyToSubsidiaryListItem(res.locals.company),
      ))

    return res
      .breadcrumb(company.name, `/companies/${company.id}`)
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
