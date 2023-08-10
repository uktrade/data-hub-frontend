/* eslint-disable camelcase */
const { transformInvestmentFDIForView } = require('./fdi')
const { transformInvestmentLandingForView } = require('./landing')
const { transformInvestmentValueForView } = require('./value')

const {
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
  transformInvestmentListItemToDisableMetaLinks,
} = require('./collection')

const {
  transformClientRelationshipManagementForView,
  transformProjectManagementForView,
  transformTeamMembersForView,
} = require('./team')

module.exports = {
  transformInvestmentValueForView,
  transformInvestmentFDIForView,
  transformInvestmentLandingForView,
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
  transformTeamMembersForView,
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
  transformInvestmentListItemToDisableMetaLinks,
}
