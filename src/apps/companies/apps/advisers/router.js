const router = require('express').Router()

const { allFeaturesOr404, allPermissionsOr403 } = require('../../../../middleware/conditionals')
const { submit, renderAdvisers, form } = require('./controllers/advisers')

router.get('/', renderAdvisers)

router.route(['/assign', '/remove'])
  .all(allFeaturesOr404('lead_advisers'))
  .all(allPermissionsOr403('company.change_regional_account_manager'))
  .get(form)
  .post(submit)

module.exports = router
