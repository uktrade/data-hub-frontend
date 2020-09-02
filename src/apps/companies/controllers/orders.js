const { search } = require('../../../modules/search/services')
const {
  transformApiResponseToCollection,
} = require('../../../modules/api/transformers')
const { transformOrderToListItem } = require('../../omis/transformers')
const urls = require('../../../lib/urls')

async function renderOrders(req, res, next) {
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
      req,
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
          { link: urls.dashboard(), text: 'Home' },
          { link: urls.companies.index(), text: 'Companies' },
          { link: urls.companies.detail(company.id), text: company.name },
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
