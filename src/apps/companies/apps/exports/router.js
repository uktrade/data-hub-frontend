const router = require('express').Router()

const urls = require('../../../../lib/urls')
const setReturnUrl = require('../../middleware/set-return-url')

const { renderExports, renderExportHistory } = require('./controllers')

router.get(urls.companies.exports.index.route, setReturnUrl, renderExports)

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
