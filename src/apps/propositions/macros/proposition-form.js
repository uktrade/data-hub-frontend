const { assign } = require('lodash')

const labels = require('../labels')
const { name, scope, deadline, adviser } = require('./fields')

module.exports = function ({
  returnLink,
  returnText,
  buttonText,
  advisers = [],
  hiddenFields,
}) {
  return {
    returnLink,
    returnText,
    buttonText,
    hiddenFields,
    children: [name, scope, adviser(advisers), deadline].map((field) => {
      return assign(field, {
        label: labels.proposition[field.name],
      })
    }),
  }
}
