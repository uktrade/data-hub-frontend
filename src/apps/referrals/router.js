const router = require('express').Router()
const urls = require('../../lib/urls')

const renderReferralDetails = require('./controller.js')

router.get(urls.referrals.details.route, renderReferralDetails)

module.exports = router
