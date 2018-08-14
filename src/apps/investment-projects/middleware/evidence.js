const { assign } = require('lodash')
const { addEvidence } = require('../../evidence/repos')

function setEvidenceReturnUrl (req, res, next) {
  res.locals.returnLink = `/investment-projects/${req.params.investmentId}/evidence`
  next()
}

async function postEvidence (req, res, next) {

  // TODO (jf): for the file input do the document upload, for the rest of the fields, run addEvidence

  try {
    await addEvidence(req.session.token, res.locals.requestBody)

    req.flash('success', 'Evidence added')

    if (res.locals.returnLink) {
      return res.redirect(res.locals.returnLink)
    }

    return res.redirect(`/evidence`)
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

module.exports = {
  setEvidenceReturnUrl,
  postEvidence,
}
