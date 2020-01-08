const router = require('express').Router()

const {
  renderProfilesView,
  fetchLargeCapitalProfilesHandler,
} = require('./controllers/profiles')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

router.get('/', setInvestmentTabItems, renderProfilesView)
router.get('/data', fetchLargeCapitalProfilesHandler)

module.exports = router
