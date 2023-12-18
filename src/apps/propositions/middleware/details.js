const { fetchProposition, fetchDownloadLink } = require('../repos')

async function getPropositionDetails(req, res, next, propositionId) {
  try {
    const { investment } = res.locals
    res.locals.proposition = await fetchProposition(
      req,
      propositionId,
      investment.id
    )

    next()
  } catch (error) {
    next(error)
  }
}

async function getDownloadLink(req, res, next) {
  try {
    const { propositionId, documentId } = req.params
    const { investment } = res.locals
    const s3 = await fetchDownloadLink(
      req,
      propositionId,
      investment.id,
      documentId
    )

    return res.redirect(s3.document_url)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDownloadLink,
  getPropositionDetails,
}
