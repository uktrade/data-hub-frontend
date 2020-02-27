const renderReferralDetails = ({ params: { referralId } }, res) => {
  res.render('referrals/apps/details/views/details-container', {
    heading: 'Referral',
    props: {
      id: referralId,
    },
  })
}

module.exports = renderReferralDetails
