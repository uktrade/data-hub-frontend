const router = require('express').Router()

const { ENTITIES } = require('../../../search/constants')

const { getCollection } = require('../../../../modules/search/middleware/collection')

const { setDefaultQuery } = require('../../../middleware')
const { renderList } = require('./controllers')
const { setRequestBody } = require('./middleware')
const { transformOrderToListItem } = require('../../transformers')

const DEFAULT_QUERY = {
  sortby: 'created_on:desc',
}

router.get('/',
  setDefaultQuery(DEFAULT_QUERY),
  setRequestBody,
  getCollection('order', ENTITIES, transformOrderToListItem),
  renderList
)

module.exports = router
