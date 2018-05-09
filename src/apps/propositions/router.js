const router = require('express').Router()

const { DEFAULT_COLLECTION_QUERY, APP_PERMISSIONS } = require('./constants')

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { renderPropositionList } = require('./controllers/list')

const { setDefaultQuery, handleRoutePermissions } = require('../middleware')
const {
  getPropositionCollection,
  getPropositionsRequestBody,
  getPropositionSortForm,
} = require('./middleware/collection')

const { postDetails, getPropositionOptions, getPropositionDetails } = require('./middleware/details')

router.use(handleRoutePermissions(APP_PERMISSIONS))

router.param('propositionId', getPropositionDetails)

router.get('/',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getPropositionsRequestBody,
  getPropositionCollection,
  getPropositionSortForm,
  renderPropositionList
)

router
  .route('/:propositionId/:kind/edit')
  .post(
    getPropositionOptions,
    postDetails,
    renderEditPage,
  )
  .get(
    getPropositionOptions,
    renderEditPage,
  )

router.get('/:propositionId', renderDetailsPage)

module.exports = router
