/* eslint-disable camelcase */
const { transformInvestmentFDIForView } = require('./fdi')
const { transformInvestmentLandingForView } = require('./landing')
const { transformInvestmentRequirementsForView } = require('./requirements')
const { transformInvestmentValueForView } = require('./value')

const {
  transformToApi,
  transformFromApi,
  transformInvestmentForView,
} = require('./project')

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
  transformInvestmentForView,
  transformInvestmentValueForView,
  transformInvestmentRequirementsForView,
  transformInvestmentFDIForView,
  transformInvestmentLandingForView,
  transformToApi,
  transformFromApi,
  transformProjectManagementForView,
  transformClientRelationshipManagementForView,
  transformTeamMembersForView,
  transformInvestmentProjectToListItem,
  transformInvestmentListItemToHaveMetaLinks,
  transformInvestmentListItemToDisableMetaLinks,
}
