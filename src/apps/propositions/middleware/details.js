const { get } = require('lodash')

const {
  fetchProposition,
  fetchDownloadLink,
  fetchPropositionFiles,
} = require('../repos')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { transformObjectToOption } = require('../../transformers')

async function getPropositionDetails(req, res, next, propositionId) {
  try {
    const { investment } = res.locals
    res.locals.proposition = await fetchProposition(
      req,
      propositionId,
      investment.id
    )
    res.locals.proposition.files = await fetchPropositionFiles(
      req,
      propositionId,
      investment.id
    )

    next()
  } catch (error) {
    next(error)
  }
}

async function getPropositionOptions(req, res, next) {
  try {
    const advisers = await getAdvisers(req)
    const currentAdviser = get(res.locals, 'proposition.adviser.id')
    const activeAdvisers = filterActiveAdvisers({
      advisers: advisers.results,
      includeAdviser: currentAdviser,
    })

    res.locals.options = {
      advisers: activeAdvisers.map(transformObjectToOption),
    }

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
  getPropositionOptions,
}
