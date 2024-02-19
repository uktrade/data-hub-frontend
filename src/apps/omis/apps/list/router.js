const router = require('express').Router()

const { QUERY_FIELDS } = require('../../constants')

const {
  exportCollection,
} = require('../../../../modules/search/middleware/collection')

const { getRequestBody } = require('../../../../middleware/collection')

router.get('/export', getRequestBody(QUERY_FIELDS), exportCollection('order'))

module.exports = router
