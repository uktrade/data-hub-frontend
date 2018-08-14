const { assign } = require('lodash')

const labels = require('../labels')
const {
  tags,
  documentUpload,
  comment,
} = require('./fields')

module.exports = function ({
  returnLink,
  returnText,
  buttonText,
  hiddenFields,
}) {
  return {
    returnLink,
    returnText,
    buttonText,
    hiddenFields,
    children: [
      tags,
      documentUpload,
      comment,
    ].map(field => {
      return assign(field, {
        label: labels.evidenceForm[field.name],
      })
    }),
  }
}
