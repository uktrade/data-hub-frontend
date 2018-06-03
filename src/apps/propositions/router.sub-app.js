const router = require('express').Router()

const { renderCreatePage } = require('./controllers/create')
const { renderDetailsPage } = require('./controllers/details')
const { renderAbandon } = require('./controllers/abandon')
const { renderComplete } = require('./controllers/complete')

const { postDetails, getPropositionOptions, getPropositionDetails } = require('./middleware/details')
const { postAbandon } = require('./middleware/abandon')
const { postComplete } = require('./middleware/complete')

router.param('propositionId', getPropositionDetails)

router
  .route('/propositions/:propositionId/abandon')
  .post(
    postAbandon,
    renderAbandon,
  )
  .get(
    renderAbandon,
  )

router
  .route('/propositions/:propositionId/complete')
  .post(
    postComplete,
    renderComplete,
  )
  .get(
    renderComplete,
  )

router.route([
  '/propositions/create/:kind',
])
  .post(
    getPropositionOptions,
    postDetails,
    renderCreatePage,
  )
  .get(
    getPropositionOptions,
    renderCreatePage,
  )

router.get('/propositions/:propositionId', renderDetailsPage)

module.exports = router
