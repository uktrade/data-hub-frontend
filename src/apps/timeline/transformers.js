/* eslint camelcase: 0 */
const dateFns = require('date-fns')
const { mediumDateFormat } = require('../../../config')

const { listLabels, sourceLabels } = require('./labels')

function transformTimelineToListItem ({ data_source, datetime, description }) {
  return {
    type: 'timeline',
    name: dateFns.format(datetime, mediumDateFormat),
    contentMetaModifier: 'stacked',
    meta: [{
      label: listLabels.data_source,
      value: sourceLabels[data_source],
    }, {
      label: listLabels.description,
      value: description,
    }],
  }
}

module.exports = { transformTimelineToListItem }
