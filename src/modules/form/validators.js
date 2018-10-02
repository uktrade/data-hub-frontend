const { isNil, isEmpty } = require('lodash')

module.exports = {
  required: value => !(isNil(value) || isEmpty(value)),
}
