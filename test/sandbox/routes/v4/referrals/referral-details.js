import referralDetailsJson from '../../../fixtures/v4/referrals/referral-details.json' assert { type: 'json' }
import referralDetailsNoContact from '../../../fixtures/v4/referrals/referral-details-no-contact.json' assert { type: 'json' }
import id from '../../../constants/referrals'

export const referralDetails = function (req, res) {
  if (req.params.id === id.REFERRAL_ID_NO_CONTACT) {
    return res.json(referralDetailsNoContact)
  }
  return res.json(referralDetailsJson)
}
