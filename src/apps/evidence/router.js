const router = require('express').Router()

const {
  renderEvidence,
} = require('./controllers')

router.get('/evidence', renderEvidence)

module.exports = router
