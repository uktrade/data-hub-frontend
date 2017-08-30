const router = require('express').Router()

const { setDefaultQuery } = require('../../../middleware')
const { getCollection, getRequestBody } = require('./middleware')
const { renderList } = require('./controllers')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'created_on:desc',
}

router.use(setDefaultQuery(DEFAULT_COLLECTION_QUERY))
router.use(getCollection)
router.use(getRequestBody)

router.get('/', renderList)

module.exports = router
