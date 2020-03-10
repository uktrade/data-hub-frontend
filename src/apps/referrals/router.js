const router = require('express').Router()
const urls = require('../../lib/urls')

const renderReferralDetails = require('./apps/details/controller')
const renderReferralHelp = require('./apps/help/controller')

const interactionsRouter = require('../interactions/router.sub-app')
const {
  setCompanyDetails,
  setInteractionsDetails,
} = require('./middleware/interactions')

router.get(urls.referrals.details.route, renderReferralDetails)
router.get(urls.referrals.help.route, renderReferralHelp)

router.use(
  '/:referralId',
  setCompanyDetails,
  setInteractionsDetails,
  interactionsRouter
)

router.post(urls.referrals.interactions.create)

module.exports = router
