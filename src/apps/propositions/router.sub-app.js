const router = require('express').Router()

const { renderCreatePage } = require('./controllers/create')
const { renderDetailsPage } = require('./controllers/details')
const { renderAbandon } = require('./controllers/abandon')
const { renderComplete } = require('./controllers/complete')
const { renderUpload } = require('./controllers/upload')

const { postDetails, getDownloadLink, getPropositionOptions, getPropositionDetails } = require('./middleware/details')
const { postAbandon } = require('./middleware/abandon')
const { postComplete } = require('./middleware/complete')
const { setPropositionDocumentUploadReturnUrl } = require('./middleware/document-upload')
const { postUpload } = require('../document-upload/middleware/upload-module')

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

router
  .route('/propositions/:propositionId/document')
  .post(
    setPropositionDocumentUploadReturnUrl,
    postUpload.bind({
      url: {
        app: 'investment',
        subApp: 'proposition',
      },
    }),
    renderUpload,
  )
  .get(
    renderUpload,
  )

router
  .route('/propositions/:propositionId/download/:documentId')
  .get(
    getDownloadLink
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
