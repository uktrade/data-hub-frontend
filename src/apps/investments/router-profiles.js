const router = require('express').Router()

const { renderProfilesView } = require('./controllers/profiles')
const setInvestmentTabItems = require('./middleware/investments-tab-items')

router.get('/', setInvestmentTabItems, renderProfilesView)

module.exports = router
