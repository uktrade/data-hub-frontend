import referrals from '../../../fixtures/v4/referrals/referral-list.js'

export default function (req, res) {
  return res.json({ count: referrals.length, results: referrals })
}
