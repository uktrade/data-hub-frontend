const router = require('express').Router()

const { allPermissionsOr403 } = require('../../../../middleware/conditionals')
const { submit, renderAdvisers, form } = require('./controllers/advisers')

router.get('/', renderAdvisers)

router
  .route(['/assign', '/remove'])
  .all(allPermissionsOr403('company.change_regional_account_manager'))
  .get(form)
  .post(submit)

module.exports = router
