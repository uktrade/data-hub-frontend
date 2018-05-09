const router = require('express').Router()

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { postCreate, renderCreate } = require('./controllers/create')

const { postDetails, getPropositionOptions, getPropositionDetails } = require('./middleware/details')

router.param('propositionId', getPropositionDetails)

router
  .route('/propositions/create')
  .post(
    postCreate,
    renderCreate,
  )
  .get(
    renderCreate,
  )

router.route([
  '/propositions/create/:kind',
  '/propositions/:propositionId/:kind/edit',
])
  .post(
    getPropositionOptions,
    postDetails,
    renderEditPage,
  )
  .get(
    getPropositionOptions,
    renderEditPage,
  )

router.get('/propositions/:propositionId', renderDetailsPage)

module.exports = router
