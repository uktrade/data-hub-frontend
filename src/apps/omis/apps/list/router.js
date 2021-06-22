const router = require('express').Router()
const urls = require('../../../../lib/urls')

const { ENTITIES } = require('../../../search/constants')

const { QUERY_FIELDS } = require('../../constants')

const {
  getCollection,
  exportCollection,
} = require('../../../../modules/search/middleware/collection')
const { setDefaultQuery } = require('../../../middleware')
const { getRequestBody } = require('../../../../middleware/collection')

const { renderList } = require('./controllers')
const { renderOrdersView } = require('./orders')
const { setRequestBody } = require('./middleware')
const { transformOrderToListItem } = require('../../transformers')

const DEFAULT_QUERY = {
  sortby: 'created_on:desc',
}

router.get(
  '/',
  setDefaultQuery(DEFAULT_QUERY),
  setRequestBody,
  getCollection('order', ENTITIES, transformOrderToListItem),
  renderList
)

// New react route (to replace the old companies list route above when complete)
router.get(urls.omis.react.index.route, renderOrdersView)

router.get(
  '/export',
  setDefaultQuery(DEFAULT_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('order')
)

module.exports = router
