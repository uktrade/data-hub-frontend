/* eslint camelcase: 0 */
const { get } = require('lodash')

function transformAdviserToOption({ id, name, dit_team } = {}) {
  return {
    value: id,
    label: name,
    subLabel: get(dit_team, 'name'),
  }
}

module.exports = { transformAdviserToOption }
