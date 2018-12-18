/* eslint-disable camelcase */
const { get, pickBy } = require('lodash')

const { getDataLabels } = require('../../../lib/controller-utils')
const { businessHierarchyLabels, hqLabels } = require('../labels')
const { pluralise } = require('../../../../config/nunjucks/filters')
const { NONE_TEXT } = require('../constants')

const transformHeadquarterType = (headquarter_type, global_headquarters) => {
  if (get(headquarter_type, 'name') === 'ghq') {
    return hqLabels.ghq
  }

  if (global_headquarters) {
    return {
      url: `/companies/${global_headquarters.id}`,
      name: `Global HQ - ${global_headquarters.name}`,
    }
  }
}

const transformSubsidiaries = (id, subsidiariesCount) => {
  return subsidiariesCount ? {
    url: `/companies/${id}/subsidiaries`,
    name: `${subsidiariesCount} ${pluralise('subsidiary', subsidiariesCount)}`,
  } : NONE_TEXT
}

module.exports = ({ id, headquarter_type, global_headquarters }, subsidiariesCount) => {
  const viewRecord = {
    headquarter_type: transformHeadquarterType(headquarter_type, global_headquarters),
    subsidiaries: transformSubsidiaries(id, subsidiariesCount),
  }

  return pickBy(getDataLabels(viewRecord, businessHierarchyLabels))
}
