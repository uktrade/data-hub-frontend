function setPropositionDocumentUploadReturnUrl(req, res, next) {
  res.locals.returnLink = `${req.baseUrl}/propositions/${req.params.propositionId}/`
  next()
}

function setDocumentsOptions(req, res, next) {
  res.locals.documents = {
    url: {
      app: 'investment',
      subApp: 'proposition',
    },
  }

  next()
}

module.exports = {
  setPropositionDocumentUploadReturnUrl,
  setDocumentsOptions,
}
