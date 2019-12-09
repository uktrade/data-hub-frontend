const router = require('express').Router()

const {
  renderEditHistory,
} = require('./controller')

router.get('/', renderEditHistory)

module.exports = router
