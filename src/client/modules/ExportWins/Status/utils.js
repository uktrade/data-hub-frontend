import { ADVISER_ROLES } from './constants'

export const sumExportValues = ({
  total_expected_export_value,
  total_expected_non_export_value,
  total_expected_odi_value,
}) =>
  total_expected_export_value +
  total_expected_non_export_value +
  total_expected_odi_value

const teamMembersContainCurrentAdvisor = (teamMembers = [], currentAdviserId) =>
  teamMembers.some(({ id }) => id === currentAdviserId)

const contributingOfficersContainCurrentAdvisor = (
  contributingOfficers = [],
  currentAdviserId
) => contributingOfficers.some(({ adviser }) => adviser.id === currentAdviserId)

const isCurrentAdviserLeadOfficer = ({ lead_officer }, currentAdviserId) =>
  // If an export win from the old service hasn't been matched
  // to a Data Hub lead officer, there won't be a lead officer ID.
  // However, there will be lead officer name and email.
  lead_officer?.id === currentAdviserId

export const createRoleTags = (item, currentAdviserId) => {
  const tag = { colour: 'blue', textTransform: 'none' }
  const tags = []

  isCurrentAdviserLeadOfficer(item, currentAdviserId) &&
    tags.push({
      ...tag,
      text: `Role: ${ADVISER_ROLES.LEAD_OFFICER}`,
    })

  teamMembersContainCurrentAdvisor(item.team_members, currentAdviserId) &&
    tags.push({
      ...tag,
      text: `Role: ${ADVISER_ROLES.TEAM_MEMBER}`,
    })

  contributingOfficersContainCurrentAdvisor(
    item.contributing_advisers,
    currentAdviserId
  ) &&
    tags.push({
      ...tag,
      text: `Role: ${ADVISER_ROLES.CONTRIBUTING_OFFICER}`,
    })

  return tags
}
