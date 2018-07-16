const { assign } = require('lodash')

const labels = require('../labels')
const {
  documentUpload,
} = require('./fields')

module.exports = function ({
  returnLink,
  returnText,
  buttonText,
  hiddenFields,
}) {
  return {
    returnLink,
    returnText: 'Don\'t upload files now',
    buttonText: 'Upload',
    hiddenFields,
    children: [
      documentUpload,
    ].map(field => {
      return assign(field, {
        label: labels.uploadForm[field.name],
      })
    }),
  }
}
