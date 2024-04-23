const router = require('express').Router()

const { renderDetailsPage } = require('./controllers/details')

const {
  getDownloadLink,
  getPropositionDetails,
} = require('./middleware/details')

router.param('propositionId', getPropositionDetails)

router
  .route('/propositions/:propositionId/download/:documentId')
  .get(getDownloadLink)

router.get('/propositions/:propositionId', renderDetailsPage)

module.exports = router
