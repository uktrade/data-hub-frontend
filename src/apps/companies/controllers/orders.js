const { search } = require('../../../modules/search/services')
const { transformApiResponseToCollection } = require('../../../modules/api/transformers')
const { transformOrderToListItem } = require('../../omis/transformers')

async function renderOrders (req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { company } = res.locals
  const actionButtons = company.archived ? undefined : [{
    label: 'Add order',
    url: `/omis/create?company=${company.id}&skip-company=true`,
  }]

  try {
    const results = await search({
      token,
      page,
      searchEntity: 'order',
      requestBody: {
        company: company.id,
      },
      isAggregation: false,
    })
      .then(transformApiResponseToCollection(
        { query: req.query },
        transformOrderToListItem,
      ))

    res
      .breadcrumb(company.name, `/companies/${company.id}`)
      .breadcrumb('Orders (OMIS)')
      .render('companies/views/orders', {
        results,
        actionButtons,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderOrders,
}
