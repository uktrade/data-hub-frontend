const router = require('express').Router()

const setInvestmentTabItems = require('./middleware/investments-tab-items')
const { renderOpportunitiesView } = require('./controllers/opportunities')

router.get('/', setInvestmentTabItems, renderOpportunitiesView)

module.exports = router
