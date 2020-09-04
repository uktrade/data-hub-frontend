const { assign } = require('lodash')

const labels = require('../labels')
const { multipleDocumentUpload } = require('./fields')

module.exports = function ({ returnLink = '', hiddenFields }) {
  return {
    enctype: 'multipart/form-data',
    returnLink,
    returnText: "Don't upload files now",
    buttonText: 'Upload',
    hiddenFields,
    children: [multipleDocumentUpload].map((field) => {
      return assign(field, {
        label: labels.uploadForm[field.name],
      })
    }),
  }
}
