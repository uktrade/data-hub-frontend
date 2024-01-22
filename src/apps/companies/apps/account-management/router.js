const router = require('express').Router()

const urls = require('../../../../lib/urls')
const { submit, form } = require('./controllers')
const { allPermissionsOr403 } = require('../../../../middleware/conditionals')

router
  .route([
    urls.companies.accountManagement.advisers.assign.route,
    urls.companies.accountManagement.advisers.remove.route,
  ])
  .all(allPermissionsOr403('company.change_regional_account_manager'))
  .get(form)
  .post(submit)

module.exports = router
