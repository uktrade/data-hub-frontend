var referrals = require('../../../fixtures/v4/referrals/referral-list')

module.exports = function (req, res) {
  return res.json({ count: referrals.length, results: referrals })
}
