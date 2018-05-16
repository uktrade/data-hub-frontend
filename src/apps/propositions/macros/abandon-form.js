const { assign } = require('lodash')

const labels = require('../labels')
const {
  abandon,
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
      abandon,
    ].map(field => {
      return assign(field, {
        label: labels.proposition[field.name],
      })
    }),
  }
}
