const { assign, get } = require('lodash')

const { transformPropositionFormBodyToApiRequest } = require('../transformers')
const { abandonProposition, fetchProposition } = require('../repos')

async function postAbandon (req, res, next) {
  res.locals.requestBody = transformPropositionFormBodyToApiRequest(req.body)

  try {
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

module.exports = {
  postAbandon,
  getPropositionDetails,
}
