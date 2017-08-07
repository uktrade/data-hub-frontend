/* eslint-disable camelcase */
const { keyBy, snakeCase } = require('lodash')

function transformObjectToOption ({ id, name }) {
  return {
    value: id,
    label: name,
  }
}

function transformStringToOption (string) {
  return {
    value: string,
    label: string,
  }
}

function transformContactToOption ({ id, first_name, last_name }) {
  return {
    value: id,
    label: `${first_name} ${last_name}`,
  }
}

/**
 * Utility to build an object from a transformed metadata array of objects so you can reference properties
 * by key rather than array index. Helpful when the array length changes.
 * @returns {{}}
 */
function buildMetaDataObj (collection) {
  return keyBy(collection, (elem) => {
    return snakeCase(elem.label)
  })
}

module.exports = {
  buildMetaDataObj,
  transformObjectToOption,
  transformStringToOption,
  transformContactToOption,
}
