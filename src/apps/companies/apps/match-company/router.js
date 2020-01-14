const router = require('express').Router()

const urls = require('../../../../lib/urls')
const {
  renderFindCompanyForm,
  renderMatchConfirmation,
  submitMatchRequest,
} = require('./controllers')

router.get(urls.companies.match.index.route, renderFindCompanyForm)
router.get(urls.companies.match.confirmation.route, renderMatchConfirmation)
router.post(urls.companies.match.confirmation.route, submitMatchRequest)

module.exports = router
