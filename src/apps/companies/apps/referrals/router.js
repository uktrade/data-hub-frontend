const router = require('express').Router()
const urls = require('../../../../lib/urls')

const renderReferralDetails = require('./details/controller')
const renderReferralHelp = require('./help/controller')
const {
  renderSendReferralForm,
  submitSendReferralForm,
} = require('./send-referral/controllers')
const interactionsRouter = require('../../../interactions/router.sub-app')
const {
  setReferralDetails,
  setInteractionsDetails,
} = require('./middleware/interactions')

router
  .route(urls.companies.referrals.send.route)
  .get(renderSendReferralForm)
  .post(submitSendReferralForm)
// the details route needs to go below the send route so that it does not try to handle the send route
router.get(urls.companies.referrals.details.route, renderReferralDetails)
router.get(urls.companies.referrals.help.route, renderReferralHelp)

// Adding an interaction to complete a referral
// This mounts the interactions sub app on the details route
router.use(
  urls.companies.referrals.interactions.index.route,
  setReferralDetails,
  setInteractionsDetails,
  interactionsRouter
)
module.exports = router
