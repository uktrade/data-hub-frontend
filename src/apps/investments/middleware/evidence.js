const {
  transformedEvidenceTextFields,
} = require('../apps/evidence/transformers')

function setEvidenceReturnUrl(req, res, next) {
  const { projects } = res.locals.paths
  const { investmentId } = req.params
  res.locals.returnLink = `${projects}/${investmentId}/evidence`
  next()
}

function setEvidenceDocumentsOptions(req, res, next) {
  res.locals.documents = {
    collectTextFields: transformedEvidenceTextFields,
    url: {
      app: 'investment',
      document: 'evidence-document',
    },
  }

  next()
}

module.exports = {
  setEvidenceReturnUrl,
  setEvidenceDocumentsOptions,
}
