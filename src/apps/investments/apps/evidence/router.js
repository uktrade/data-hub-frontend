const router = require('express').Router()

const {
  renderAddEvidence,
} = require('./controllers/index')

router.get('/evidence', renderAddEvidence)

module.exports = router
