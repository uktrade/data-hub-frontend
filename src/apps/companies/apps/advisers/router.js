const router = require('express').Router()

const { allFeaturesOr404, allPermissionsOr403 } = require('../../../../middleware/conditionals')
const { renderAdvisers, renderAddAdviserForm, addAdviser } = require('./controllers/advisers')

router.get('/', renderAdvisers)

router.route('/assign')
  .all(allFeaturesOr404('lead_advisers'))
  .all(allPermissionsOr403('company.change_regional_account_manager'))
  .get(renderAddAdviserForm)
  .post(addAdviser)

module.exports = router
