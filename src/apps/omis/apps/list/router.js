const router = require('express').Router()
const urls = require('../../../../lib/urls')
const { QUERY_FIELDS } = require('../../constants')

const {
  exportCollection,
} = require('../../../../modules/search/middleware/collection')

const { getRequestBody } = require('../../../../middleware/collection')

const { renderOrdersView } = require('./orders')

router.get(urls.omis.index(), renderOrdersView)

router.get('/export', getRequestBody(QUERY_FIELDS), exportCollection('order'))

module.exports = router
