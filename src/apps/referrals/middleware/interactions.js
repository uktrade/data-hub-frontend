const { getReferral } = require('../repos')

async function setCompanyDetails(req, res, next) {
  try {
    const referral = await getReferral(req.session.token, req.params.referralId)
    res.locals.company = referral.company
    res.locals.contact = referral.contact
    next()
  } catch (error) {
    next(error)
  }
}

function setInteractionsDetails(req, res, next) {
  const referralId = req.params.referralId
  res.locals.interactions = {
    returnLink: `/referrals/${req.params.referralId}/interactions/`,
    referralId: referralId,
    canAdd: true,
    showCompany: true,
  }
  res.breadcrumb([
    {
      text: 'Referral',
      href: `/referrals/${referralId}`,
    },
  ]),
    next()
}

module.exports = {
  setInteractionsDetails,
  setCompanyDetails,
}
