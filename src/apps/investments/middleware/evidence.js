const {
  fetchDownloadLink,
  requestDeleteEvidence,
} = require('../apps/evidence/repos')
const {
  transformedEvidenceTextFields,
} = require('../apps/evidence/transformers')

function setEvidenceReturnUrl(req, res, next) {
  const { projects } = res.locals.paths
  const { investmentId } = req.params
  res.locals.returnLink = `${projects}/${investmentId}/evidence`
  next()
}

async function getDownloadLink(req, res, next) {
  try {
    const evidenceId = req.params.evidenceId
    const investmentId = req.params.investmentId
    const s3 = await fetchDownloadLink(req, investmentId, evidenceId)

    return res.redirect(s3.document_url)
  } catch (error) {
    next(error)
  }
}

async function deleteEvidence(req, res, next) {
  try {
    const evidenceId = req.params.evidenceId
    const investmentId = req.params.investmentId

    await requestDeleteEvidence(req, investmentId, evidenceId).then(() => {
      req.flash('success', 'Evidence item deleted')
      res.redirect(res.locals.returnLink)
    })
  } catch (error) {
    next(error)
  }
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
  deleteEvidence,
  getDownloadLink,
  setEvidenceDocumentsOptions,
}
