const { renderCreateInvestorProfilePage } = require('./controllers/create/investor-profile')
const { createProfile } = require('./controllers/create/create-profile')
const router = require('express').Router()

router
  .get('/', renderCreateInvestorProfilePage)
  .post('/', createProfile, renderCreateInvestorProfilePage)

module.exports = router
