const router = require('express').Router()

const { setDefaultQuery } = require('../../../middleware')
const { getCollection, getRequestBody } = require('./middleware')
const { renderList } = require('./controllers')
const { SORT_OPTIONS } = require('./constants')

const DEFAULT_COLLECTION_QUERY = {
  sortby: SORT_OPTIONS[0].value,
}

router.use(setDefaultQuery(DEFAULT_COLLECTION_QUERY))
router.use(getCollection)
router.use(getRequestBody)

router.get('/', renderList)

module.exports = router
