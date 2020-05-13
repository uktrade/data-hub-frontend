const router = require('express').Router()
const urls = require('../../../../lib/urls')
const setReturnUrl = require('../../middleware/set-return-url')

const {
  renderExports,
  populateExportForm,
  renderExportEdit,
  handleEditFormPost,
  renderExportHistory,
  renderExportEditCountries,
} = require('./controllers')

router.get(urls.companies.exports.index.route, setReturnUrl, renderExports)
router.get(urls.companies.exports.edit.route, renderExportEdit)

router
  .route(urls.companies.exports.editCountries.route)
  .get(populateExportForm, renderExportEditCountries)
  .post(populateExportForm, handleEditFormPost, renderExportEditCountries)

router.get(
  urls.companies.exports.history.index.route,
  setReturnUrl,
  renderExportHistory
)
router.get(
  urls.companies.exports.history.country.route,
  setReturnUrl,
  renderExportHistory
)

module.exports = router
