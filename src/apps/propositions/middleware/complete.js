const { get } = require('lodash')

const { fetchProposition } = require('../repos')
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

    next()
  } catch (err) {
    next(err)
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
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getPropositionDetails,
  getPropositionOptions,
}
