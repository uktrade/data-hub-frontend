const { renderProfilesView } = require('../controllers/profiles')
const setInvestmentTabItems = require('../middleware/investments-tab-items')

const router = require('express').Router()

router.get('/', setInvestmentTabItems, renderProfilesView)

module.exports = router
