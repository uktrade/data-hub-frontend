const { fetchDownloadLink, requestDeleteEvidence } = require('../apps/evidence/repos')
const { transformedEvidenceFieldsRequest } = require('../apps/evidence/transformers')

function setEvidenceReturnUrl (req, res, next) {
  res.locals.returnLink = `/investment-projects/${req.params.investmentId}/evidence`
  next()
}

async function collectEvidenceFields (req, res, fields) {
  res.locals.requestBody = await transformedEvidenceFieldsRequest(fields)
}

async function getDownloadLink (req, res, next) {
  try {
    const token = req.session.token
    const evidenceId = req.params.evidenceId
    const investmentId = req.params.investmentId
    const s3 = await fetchDownloadLink(token, investmentId, evidenceId)

    return res.redirect(s3.document_url)
  } catch (error) {
    next(error)
  }
}

async function deleteEvidence (req, res, next) {
  try {
    const token = req.session.token
    const evidenceId = req.params.evidenceId
    const investmentId = req.params.investmentId

    await requestDeleteEvidence(token, investmentId, evidenceId)
      .then(() => {
        req.flash('success', 'Evidence item deleted')
        res.redirect(res.locals.returnLink)
      })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  setEvidenceReturnUrl,
  collectEvidenceFields,
  deleteEvidence,
  getDownloadLink,
}
