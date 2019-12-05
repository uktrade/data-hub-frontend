const router = require('express').Router()

const {
  renderAddEvidence,
} = require('./controllers')

router.get('/evidence', renderAddEvidence)

module.exports = router
