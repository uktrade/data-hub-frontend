const { assign } = require('lodash')
const formidable = require('formidable')

const { fetchDownloadLink } = require('../apps/evidence/repos')
const authorisedRequest = require('../../../lib/authorised-request')

const { transformedEvidenceFieldsRequest } = require('../apps/evidence/transformers')

function setEvidenceReturnUrl (req, res, next) {
  res.locals.returnLink = `/investment-projects/${req.params.investmentId}/evidence`
  next()
}

async function collectEvidenceFields (req, res, next) {

  const form = new formidable.IncomingForm()
  try {
    form.parse(req, (err, fields) => {
      res.locals.requestBody = transformedEvidenceFieldsRequest(fields)

      if (err) {
        return res.status(500).json({ error: err })
      }
    })

    console.log(':::::::::: collectEvidenceFields ::::::::::: ', res.locals.requestBody)
    next()
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

module.exports = {
  setEvidenceReturnUrl,
  collectEvidenceFields,
  getDownloadLink,
}
