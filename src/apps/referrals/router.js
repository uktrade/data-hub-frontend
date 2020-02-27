const router = require('express').Router()
const urls = require('../../lib/urls')

const renderReferralDetails = require('./apps/details/controller')
const renderReferralHelp = require('./apps/help/controller')

router.get(urls.referrals.details.route, renderReferralDetails)
router.get(urls.referrals.help.route, renderReferralHelp)

module.exports = router
