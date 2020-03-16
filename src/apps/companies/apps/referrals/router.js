const router = require('express').Router()
const urls = require('../../../../lib/urls')

const renderReferralDetails = require('./details/controller')
const renderReferralHelp = require('./help/controller')
const {
  renderSendReferralForm,
  submitSendReferralForm,
} = require('./send-referral/controllers')

router.get(urls.companies.referrals.details.route, renderReferralDetails)
router.get(urls.companies.referrals.help.route, renderReferralHelp)
router.get(urls.companies.referrals.send.route, renderSendReferralForm)
router.post(urls.companies.referrals.send.route, submitSendReferralForm)

module.exports = router
