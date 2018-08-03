const router = require('express').Router()

const {
  renderUpload,
} = require('./controllers')

router.get('/document-upload', renderUpload)

module.exports = router
