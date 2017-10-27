const { search } = require('../../search/services')
const { transformApiResponseToCollection } = require('../../transformers')
const { transformOrderToListItem } = require('../../omis/transformers')

async function renderOrders (req, res, next) {
  const token = req.session.token
  const page = req.query.page || 1
  const { id, name } = res.locals.company

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

    res
      .breadcrumb(name, `/companies/${id}`)
      .breadcrumb('Orders (OMIS)')
      .render('companies/views/orders', {
        results,
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderOrders,
}
