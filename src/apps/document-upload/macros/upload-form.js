const { assign } = require('lodash')

const labels = require('../labels')
const {
  documentUpload,
  documentUpload01,
  documentUpload02,
  documentUpload03,
  documentUpload04,
} = require('./fields')

module.exports = function ({
  returnLink,
  returnText,
  buttonText,
  hiddenFields,
}) {
  return {
    enctype: 'multipart/form-data',
    returnLink,
    returnText: 'Don\'t upload files now',
    buttonText: 'Upload',
    hiddenFields,
    children: [
      documentUpload,
      documentUpload01,
      documentUpload02,
      documentUpload03,
      documentUpload04,
    ].map(field => {
      return assign(field, {
        label: labels.uploadForm[field.name],
      })
    }),
  }
}
