const {
  transformApiResponseToSearchCollection,
} = require('../../../modules/search/transformers')
const { transformCompanyToSubsidiaryListItem } = require('../transformers')
const { getCompanySubsidiaries } = require('../repos')
const { companyDetailsLabels } = require('../labels')
const { ENTITIES } = require('../../search/constants')

async function renderSubsidiaries(req, res, next) {
  try {
    const { company } = res.locals
    const actionButtons = company.archived
      ? undefined
      : [
          {
            label: companyDetailsLabels.link_a_subsidiary,
            url: `/companies/${company.id}/subsidiaries/link`,
          },
        ]

    const subsidiaryCollection = await getCompanySubsidiaries(
      req,
      company.id,
      req.query.page
    ).then(
      transformApiResponseToSearchCollection(
        { query: req.query },
        ENTITIES,
        transformCompanyToSubsidiaryListItem(res.locals.company)
      )
    )

    return res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb(
        'Business details',
        `/companies/${company.id}/business-details`
      )
      .breadcrumb(companyDetailsLabels.subsidiaries)
      .render('companies/views/subsidiaries', {
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
