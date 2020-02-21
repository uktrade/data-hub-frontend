var referralDetails = require('../../../fixtures/v4/referrals/referral-details.json')

exports.referralDetails = function(req, res) {
  res.json(referralDetails)
}
