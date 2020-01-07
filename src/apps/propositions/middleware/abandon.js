const { assign } = require('lodash')

const { transformPropositionFormBodyToApiRequest } = require('../transformers')
const { abandonProposition, fetchProposition } = require('../repos')

async function postAbandon(req, res, next) {
  try {
    res.locals.requestBody = transformPropositionFormBodyToApiRequest(req.body)
    await abandonProposition(req.session.token, res.locals.requestBody)

    req.flash('success', 'Proposition abandoned')

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

module.exports = {
  postAbandon,
  getPropositionDetails,
}
