const router = require('express').Router()

const urls = require('../../../../lib/urls')

const { setDefaultQuery } = require('../../../middleware')
const { getRequestBody } = require('../../../../middleware/collection')
const {
  exportCollection,
} = require('../../../../modules/search/middleware/collection')
const lastInteractionDate = require('../../middleware/last-interaction-date')
const setReturnUrl = require('../../middleware/set-return-url')

const { DEFAULT_COLLECTION_QUERY, QUERY_FIELDS } = require('../../constants')

const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
} = require('./exports')

router.get(
  urls.companies.export.route,
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS),
  lastInteractionDate,
  exportCollection('company')
)

router.get(urls.companies.exports.index.route, setReturnUrl, renderExports)

router
  .route(urls.companies.exports.edit.route)
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)

module.exports = router
