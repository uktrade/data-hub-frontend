var referralDetails = require('../../../fixtures/v4/referrals/referral-details.json')
var referralDetailsNoContact = require('../../../fixtures/v4/referrals/referral-details-no-contact.json')
var id = require('../../../constants/referrals')

exports.referralDetails = function (req, res) {
  if (req.params.id === id.REFERRAL_ID_NO_CONTACT) {
    return res.json(referralDetailsNoContact)
  }
  return res.json(referralDetails)
}
