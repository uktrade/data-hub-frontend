const { assign, get } = require('lodash')

const { completeProposition, fetchProposition } = require('../repos')
const { getAdvisers } = require('../../adviser/repos')
const { filterActiveAdvisers } = require('../../adviser/filters')
const { transformObjectToOption } = require('../../transformers')

function transformErrorMessage(error) {
  return get(error, 'non_field_errors', ['There has been an error'])[0]
}

async function postComplete(req, res, next) {
  try {
    await completeProposition(req, res, next)

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

      req.flash('error', transformErrorMessage(err.error))
      return res.redirect(res.locals.returnLink)
    } else {
      next(err)
    }
  }
}

async function getPropositionDetails(req, res, next, propositionId) {
  try {
    const token = req.session.token
    const { investment } = res.locals
    res.locals.proposition = await fetchProposition(
      token,
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
