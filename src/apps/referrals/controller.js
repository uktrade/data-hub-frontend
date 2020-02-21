const renderReferralDetails = ({ params: { referralId } }, res) => {
  res.breadcrumb('Referral').render('referrals/views/details-container', {
    heading: 'Referral',
    props: {
      id: referralId,
    },
  })
}

module.exports = renderReferralDetails
