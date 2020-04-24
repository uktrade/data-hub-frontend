const { search } = require('../../../modules/search/services')
const {
  transformApiResponseToCollection,
} = require('../../../modules/api/transformers')
const { transformOrderToListItem } = require('../../omis/transformers')
const { companies, dashboard } = require('../../../lib/urls')

async function renderOrders(req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { company, returnUrl, dnbRelatedCompaniesCount } = res.locals
  const actionButtons = company.archived
    ? undefined
    : [
        {
          label: 'Add order',
          url: `/omis/create?company=${company.id}&skip-company=true`,
        },
      ]

  try {
    const results = await search({
      token,
      page,
      searchEntity: 'order',
      requestBody: {
        company: company.id,
      },
      isAggregation: false,
    }).then(
      transformApiResponseToCollection(
        { query: req.query },
        transformOrderToListItem
      )
    )

    res.render('companies/views/orders', {
      results,
      actionButtons,
      props: {
        company,
        breadcrumbs: [
          { link: dashboard(), text: 'Home' },
          { link: companies.index(), text: 'Companies' },
          { link: companies.detail(company.id), text: company.name },
          { text: 'Orders (OMIS)' },
        ],
        returnUrl,
        dnbRelatedCompaniesCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderOrders,
}
