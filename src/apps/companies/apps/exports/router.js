const router = require('express').Router()
const urls = require('../../../../lib/urls')
const setReturnUrl = require('../../middleware/set-return-url')

const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
  renderExportHistory,
} = require('./controllers')

router.get(urls.companies.exports.index.route, setReturnUrl, renderExports)
router
  .route(urls.companies.exports.edit.route)
  .get(populateExportForm, renderExportEdit)
  .post(populateExportForm, handleEditFormPost, renderExportEdit)
router.get(urls.companies.exports.history.index.route, renderExportHistory)
router.get(urls.companies.exports.history.country.route, renderExportHistory)

module.exports = router
