const router = require('express').Router()

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { postCreate, renderCreate } = require('./controllers/create')
const { handlePolicyPermissions } = require('./middleware/policy-permissions')
const { postDetails, getInteractionDetails } = require('./middleware/details')

router.param('interactionId', getInteractionDetails)

router
  .route('/interactions/create')
  .post(
    handlePolicyPermissions('add'),
    postCreate,
    renderCreate,
  )
  .get(
    renderCreate,
  )

router.route('/interactions/create/:kind')
  .post(handlePolicyPermissions('create'), postDetails, renderEditPage)
  .get(handlePolicyPermissions('create'), renderEditPage)

router.route('/interactions/:interactionId/:kind/edit')
  .post(handlePolicyPermissions('edit'), postDetails, renderEditPage)
  .get(handlePolicyPermissions('edit'), renderEditPage)

router.get('/interactions/:interactionId', handlePolicyPermissions('read'), renderDetailsPage)

module.exports = router
