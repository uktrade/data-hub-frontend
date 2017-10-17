const router = require('express').Router()

const { setDefaultQuery } = require('../../../middleware')
const { setCollectionResults, setRequestBody } = require('./middleware')
const { renderList } = require('./controllers')

const DEFAULT_COLLECTION_QUERY = {
  sortby: 'created_on:desc',
}

router.use(setDefaultQuery(DEFAULT_COLLECTION_QUERY))
router.use(setCollectionResults)
router.use(setRequestBody)

router.get('/', renderList)

module.exports = router
