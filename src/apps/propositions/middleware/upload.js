const { assign } = require('lodash')

const { getDocumentUploadS3Url, uploadDocumenToS3 } = require('../repos')

async function postUpload (req, res, next) {
  res.locals.requestBody = req.body

  // const formData = new FormData(req.body)
  // console.log('>>>>>>>>>>> ', req, formData)

  try {
    const options = await getDocumentUploadS3Url(req.session.token, res.locals.requestBody)

    // req.flash('success', 'Upload completed')
    //
    // if (res.locals.returnLink) {
    //   return res.redirect(res.locals.returnLink)
    // }
    //
    // return res.redirect(`/propositions`)
    console.log('>>>>>>>>>>> ', options)

    uploadDocumenToS3(req.session.token, options.id, options.signed_upload_url)

    // res.json(uploadResponse)
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
  postUpload,
}
