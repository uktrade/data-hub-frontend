const router = require('express').Router()

const urls = require('../../../../lib/urls')

const interactionsRouter = require('../../../interactions/router.sub-app')
const {
  setReferralDetails,
  setInteractionsDetails,
} = require('./middleware/interactions')

// Adding an interaction to complete a referral
// This mounts the interactions sub app on the details route
router.use(
  urls.companies.referrals.interactions.index.route,
  setReferralDetails,
  setInteractionsDetails,
  interactionsRouter
)
module.exports = router
