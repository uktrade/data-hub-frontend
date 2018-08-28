function setPropositionDocumentUploadReturnUrl (req, res, next) {
  res.locals.returnLink = `${req.baseUrl}/propositions/${req.params.propositionId}/`
  next()
}

module.exports = {
  setPropositionDocumentUploadReturnUrl,
}
