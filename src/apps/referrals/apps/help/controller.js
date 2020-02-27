const renderReferralHelp = ({ params: { referralId } }, res) => {
  res.render('referrals/apps/help/views/help-container', {
    heading: 'Help to complete this Referral',
    props: {
      id: referralId,
    },
  })
}

module.exports = renderReferralHelp
