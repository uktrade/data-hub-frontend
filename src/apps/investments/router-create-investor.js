const router = require('express').Router()

const { renderCreateInvestorProfilePage } = require('./controllers/create/investor-profile')
const { createProfile } = require('./controllers/create/create-profile')

router
  .get('/', renderCreateInvestorProfilePage)
  .post('/', createProfile, renderCreateInvestorProfilePage)

module.exports = router
