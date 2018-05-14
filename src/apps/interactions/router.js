const router = require('express').Router()

const { DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS } = require('./constants')

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { renderInteractionList } = require('./controllers/list')

const { setDefaultQuery, handleRoutePermissions } = require('../middleware')
const {
  getInteractionCollection,
  getInteractionsRequestBody,
  getInteractionSortForm,
} = require('./middleware/collection')

const { postDetails, getInteractionDetails } = require('./middleware/details')
const { handlePolicyPermissions } = require('./middleware/policy-permissions')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('interactionId', getInteractionDetails)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getInteractionsRequestBody,
  getInteractionCollection,
  getInteractionSortForm,
  renderInteractionList
)

router
  .route('/:interactionId/:kind/edit')
  .post(handlePolicyPermissions('edit'), postDetails, renderEditPage)
  .get(handlePolicyPermissions('edit'), renderEditPage)

router.get('/:interactionId', handlePolicyPermissions('read'), renderDetailsPage)

module.exports = router
