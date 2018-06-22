const { assign, get } = require('lodash')

const { transformPropositionFormBodyToApiRequest } = require('../transformers')
const { completeProposition, fetchProposition } = require('../repos')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { transformObjectToOption } = require('../../transformers')

async function postComplete (req, res, next) {
  res.locals.requestBody = transformPropositionFormBodyToApiRequest(req.body)

  try {
    await completeProposition(req.session.token, res.locals.requestBody)

    req.flash('success', 'Proposition completed')

    if (res.locals.returnLink) {
      return res.redirect(res.locals.returnLink)
    }

    return res.redirect(`/propositions`)
  } catch (err) {
    if (err.statusCode === 400) {
      res.locals.form = assign({}, res.locals.form, {
        errors: {
          messages: err.error,
        },
      })
      next()
    } else {
      next(err)
    }
  }
}

async function getPropositionDetails (req, res, next, propositionId) {
  try {
    const token = req.session.token
    const investmentId = get(res.locals, 'investmentData.id')
    res.locals.proposition = await fetchProposition(token, propositionId, investmentId)

    next()
  } catch (err) {
    next(err)
  }
}

async function getPropositionOptions (req, res, next) {
  try {
    const token = req.session.token
    const advisers = await getAdvisers(token)
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
  postComplete,
  getPropositionDetails,
  getPropositionOptions,
}
