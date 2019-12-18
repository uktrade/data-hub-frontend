const router = require('express').Router()

const {
  renderEditHistory,
  fetchCompanyAuditLog,
} = require('./controller')

router.get('/', renderEditHistory)
router.get('/data', fetchCompanyAuditLog)

module.exports = router
