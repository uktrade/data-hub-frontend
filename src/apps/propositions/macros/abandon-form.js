const { assign } = require('lodash')

const labels = require('../labels')
const { abandon } = require('./fields')

module.exports = function ({ returnLink, returnText, hiddenFields }) {
  return {
    returnLink,
    returnText,
    buttonText: 'Abandon proposition',
    hiddenFields,
    children: [abandon].map((field) => {
      return assign(field, {
        label: labels.abandonProposition[field.name],
      })
    }),
    buttonModifiers: 'govuk-button--warning',
  }
}
