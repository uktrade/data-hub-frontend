function setEvidenceReturnUrl (req, res, next) {
  res.locals.returnLink = `/investment-projects/${req.params.investmentId}/propositions`
  next()
}

module.exports = {
  setEvidenceReturnUrl,
}
