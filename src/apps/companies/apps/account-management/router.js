const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { renderAccountManagement } = require('./controllers')

router.get(
  urls.companies.accountManagement.index.route,
  renderAccountManagement
)

module.exports = router
