const { search } = require('../../search/services')
const { transformApiResponseToCollection } = require('../../../modules/api/transformers')
const { transformOrderToListItem } = require('../../omis/transformers')

async function renderOrders (req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { id, name, archived } = res.locals.company

  try {
    const results = await search({
      token,
      page,
      searchEntity: 'order',
      requestBody: {
        company: id,
      },
      isAggregation: false,
    })
      .then(transformApiResponseToCollection(
        { query: req.query },
        transformOrderToListItem,
      ))

    const actionButtons = archived ? undefined : [{
      label: 'Add order',
      url: `/omis/create?company=${id}&skip-company=true`,
    }]

    res
      .breadcrumb(name, `/companies/${id}`)
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
