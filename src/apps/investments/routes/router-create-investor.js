const { renderCreateInvestorProfilePage } = require('../controllers/create/investor-profile')
const setInvestmentTabItems = require('../middleware/investments-tab-items')

const router = require('express').Router()

router.get('/', setInvestmentTabItems, renderCreateInvestorProfilePage)

module.exports = router
