const router = require('express').Router()

const { ENTITIES } = require('../../../search/constants')

const { QUERY_FIELDS } = require('../../constants')

const {
  getCollection,
  exportCollection,
} = require('../../../../modules/search/middleware/collection')
const { setDefaultQuery } = require('../../../middleware')
const { getRequestBody } = require('../../../../middleware/collection')

const { renderList } = require('./controllers')
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

router.get(
  '/export',
  setDefaultQuery(DEFAULT_QUERY),
  getRequestBody(QUERY_FIELDS),
  exportCollection('order')
)

module.exports = router
