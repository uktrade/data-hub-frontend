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
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
  transformTeamMembersForView,
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
  transformInvestmentListItemToDisableMetaLinks,
}
