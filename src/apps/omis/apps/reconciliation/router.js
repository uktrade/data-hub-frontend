const router = require('express').Router()

const { ENTITIES } = require('../../../search/constants')

const {
  getCollection,
} = require('../../../../modules/search/middleware/collection')

const { setDefaultQuery } = require('../../../middleware')
const { setOrder } = require('../../middleware')
const { renderList } = require('./controllers')
const { transformOrderToTableItem } = require('../../transformers')

const DEFAULT_QUERY_RECONCILIATION = {
  sortby: 'payment_due_date:asc',
  status: 'quote_accepted',
}

router.param('orderId', setOrder)

router.get(
  '/',
  setDefaultQuery(DEFAULT_QUERY_RECONCILIATION),
  getCollection('order', ENTITIES, transformOrderToTableItem),
  renderList
)

module.exports = router
