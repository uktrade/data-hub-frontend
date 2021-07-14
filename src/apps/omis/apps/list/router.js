const router = require('express').Router()
const urls = require('../../../../lib/urls')
const { QUERY_FIELDS } = require('../../constants')

const {
  // getCollection,
  exportCollection,
} = require('../../../../modules/search/middleware/collection')
const { setDefaultQuery } = require('../../../middleware')
const { getRequestBody } = require('../../../../middleware/collection')

const { renderOrdersView } = require('./orders')

const DEFAULT_QUERY = {
  sortby: 'created_on:desc',
}

// TODO:remove OMIS order legacy list implementation
// const { ENTITIES } = require('../../../search/constants')
// const { renderList } = require('./controllers')
// const { setRequestBody } = require('./middleware')
// const { transformOrderToListItem } = require('../../transformers')
// router.get(
//   '/',
//   setDefaultQuery(DEFAULT_QUERY),
//   setRequestBody,
//   getCollection('order', ENTITIES, transformOrderToListItem),
//   renderList
// )

router.get(urls.omis.index.route, renderOrdersView)

router.get(
  '/export',
  setDefaultQuery(DEFAULT_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('order')
)

module.exports = router
