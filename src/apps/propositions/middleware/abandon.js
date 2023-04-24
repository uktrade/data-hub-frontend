const { fetchProposition } = require('../repos')

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

module.exports = {
  getPropositionDetails,
}
