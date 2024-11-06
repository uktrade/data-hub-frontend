import { ADVISER_ROLES } from './constants'

export const sumExportValues = ({
  total_expected_export_value,
  total_expected_non_export_value,
  total_expected_odi_value,
}) =>
  total_expected_export_value +
  total_expected_non_export_value +
  total_expected_odi_value

/**
 * Checks if the current adviser is among the team members for an export win.
 *
 * @param {Array} teamMembers - Array of team member objects.
 * @param {string} currentAdviserId - The ID of the current adviser.
 * @returns {boolean} True if the current adviser is found among the team members, otherwise false.
 *
 * Note:
 * - For export wins migrated to Data Hub, the teamMembers array will always be empty.
 * - If a team member was added directly to an export win on Data Hub, the array will be populated.
 */
const teamMembersContainCurrentAdvisor = (teamMembers = [], currentAdviserId) =>
  teamMembers.some(({ id }) => id === currentAdviserId)

/**
 * Checks if the current adviser is among the contributing officers for an export win.
 *
 * @param {Array} contributingOfficers - Array of contributing officer objects.
 * @param {string} currentAdviserId - The ID of the current adviser.
 * @returns {boolean} True if the current adviser is found among the contributing officers, otherwise false.
 *
 * Note:
 * - In a contributing officer object, the adviser field will be null if the export win
 *   was migrated to Data Hub and no matching Data Hub adviser is found. In this case,
 *   the name field will still be populated.
 * - If a contributing officer was added directly on Data Hub, the adviser field
 *   will be defined.
 */
const contributingOfficersContainCurrentAdvisor = (
  contributingOfficers = [],
  currentAdviserId
) =>
  contributingOfficers.some(({ adviser }) => adviser?.id === currentAdviserId)

/**
 * Checks if the current adviser is the lead officer for an export win.
 *
 * @param {Object} exportWin - The export win object.
 * @param {Object} exportWin.lead_officer - The lead officer object.
 * @param {string} currentAdviserId - The ID of the current adviser.
 * @returns {boolean} True if the current adviser is the lead officer, otherwise false.
 *
 * Note:
 * - The lead_officer field will be null if the export win was migrated to Data Hub
 *   and no matching Data Hub adviser is found. In this case, the name and email fields
 *   will still be populated.
 * - If the lead officer was added directly on Data Hub, the lead_officer field
 *   will be populated.
 */
const isCurrentAdviserLeadOfficer = ({ lead_officer }, currentAdviserId) =>
  lead_officer?.id === currentAdviserId

export const createRoleTags = (exportWin, currentAdviserId) => {
  const tags = []

  isCurrentAdviserLeadOfficer(exportWin, currentAdviserId) &&
    tags.push({
      text: `Role: ${ADVISER_ROLES.LEAD_OFFICER}`,
    })

  teamMembersContainCurrentAdvisor(exportWin.team_members, currentAdviserId) &&
    tags.push({
      text: `Role: ${ADVISER_ROLES.TEAM_MEMBER}`,
    })

  contributingOfficersContainCurrentAdvisor(
    exportWin.contributing_advisers,
    currentAdviserId
  ) &&
    tags.push({
      text: `Role: ${ADVISER_ROLES.CONTRIBUTING_OFFICER}`,
    })

  return tags
}
