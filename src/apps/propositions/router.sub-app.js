const router = require('express').Router()

const { renderDetailsPage } = require('./controllers/details')
const { renderUpload } = require('./controllers/upload')

const {
  getDownloadLink,
  getPropositionDetails,
} = require('./middleware/details')
const {
  setPropositionDocumentUploadReturnUrl,
  setDocumentsOptions,
} = require('./middleware/document-upload')
const { postUpload } = require('../documents/middleware/upload')

router.param('propositionId', getPropositionDetails)

router
  .route('/propositions/:propositionId/document')
  .post(
    setPropositionDocumentUploadReturnUrl,
    setDocumentsOptions,
    postUpload,
    renderUpload
  )
  .get(renderUpload)

router
  .route('/propositions/:propositionId/download/:documentId')
  .get(getDownloadLink)

router.get('/propositions/:propositionId', renderDetailsPage)

module.exports = router
