const router = require('express').Router()

const { renderEditPage } = require('./controllers/edit')
const { renderDetailsPage } = require('./controllers/details')
const { renderAbandon } = require('./controllers/abandon')
const { postCreate, renderCreate } = require('./controllers/create')

const { postDetails, getPropositionOptions, getPropositionDetails } = require('./middleware/details')
const { postAbandon } = require('./middleware/abandon')

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

router
  .route('/propositions/:propositionId/abandon')
  .post(
    postAbandon,
    renderAbandon,
  )
  .get(
    renderAbandon,
  )

// router
//   .route('/propositions/:propositionId/complete')
//   .post(
//     postCreate,
//     renderCreate,
//   )
//   .get(
//     renderCreate,
//   )

// TODO (jf): find out what kind is, and if it's actually needed here
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
