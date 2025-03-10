import referralDetails from '../../../fixtures/v4/referrals/referral-details.json' with { type: 'json' }
import referralDetailsNoContact from '../../../fixtures/v4/referrals/referral-details-no-contact.json' with { type: 'json' }
import { REFERRAL_ID_NO_CONTACT } from '../../../constants/referrals'

export const getReferralDetails = function (req, res) {
  if (req.params.id === REFERRAL_ID_NO_CONTACT) {
    return res.json(referralDetailsNoContact)
  }
  return res.json(referralDetails)
}
