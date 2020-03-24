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
  setCompanyDetails,
  setInteractionsDetails,
} = require('./middleware/interactions')

router.get(urls.companies.referrals.details.route, renderReferralDetails)
router.get(urls.companies.referrals.help.route, renderReferralHelp)
router.get(urls.companies.referrals.send.route, renderSendReferralForm)
router.post(urls.companies.referrals.send.route, submitSendReferralForm)

// Adding an interaction to complete a referral
// This mounts the interactions sub app on the details route
router.use(
  urls.companies.referrals.details.route,
  setCompanyDetails,
  setInteractionsDetails,
  interactionsRouter
)
module.exports = router
