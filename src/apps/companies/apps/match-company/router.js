const router = require('express').Router()

const urls = require('../../../../lib/urls')
const {
  renderFindCompanyForm,
  findDnbCompany,
  renderMatchConfirmation,
  submitMatchRequest,
  renderCannotFindMatch,
} = require('./controllers')

router.get(urls.companies.match.index.route, renderFindCompanyForm)
router.post(urls.companies.match.index.route, findDnbCompany)
router.get(urls.companies.match.cannotFind.route, renderCannotFindMatch)
router.get(urls.companies.match.confirmation.route, renderMatchConfirmation)
router.post(urls.companies.match.confirmation.route, submitMatchRequest)

module.exports = router
