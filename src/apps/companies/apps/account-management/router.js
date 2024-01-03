const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { submit, renderAccountManagement, form } = require('./controllers')
const { allPermissionsOr403 } = require('../../../../middleware/conditionals')

router.get(
  urls.companies.accountManagement.index.route,
  renderAccountManagement
)

router
  .route([
    urls.companies.accountManagement.advisers.assign.route,
    urls.companies.accountManagement.advisers.remove.route,
  ])
  .all(allPermissionsOr403('company.change_regional_account_manager'))
  .get(form)
  .post(submit)

module.exports = router
