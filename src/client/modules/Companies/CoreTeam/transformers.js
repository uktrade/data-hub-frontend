import { transformObjectToTypeahead } from '../../../../apps/transformers'
import { NONE, NONE_LABEL, IGNORED_TIERS } from './constants'

const isAccountManager = (adviser) => adviser.isGlobalAccountManager
const isAdviser = (adviser) => !adviser.isGlobalAccountManager

export const transformOneListTiers = (tiers) =>
  tiers
    ? transformObjectToTypeahead(tiers)
        .filter((tier) => !IGNORED_TIERS.includes(tier.value))
        .concat([{ value: NONE, label: NONE_LABEL }])
    : []

export const transformAdviserData = (adviser) => {
  if (adviser) {
    return {
      label: `${adviser.name}${
        adviser.dit_team ? ', ' + adviser.dit_team.name : ''
      }`,
      value: adviser.id,
      chipLabel: adviser.name,
    }
  }
  return adviser
}

export const transformTeamMembers = (oneListTeam) =>
  oneListTeam
    ? oneListTeam.filter(isAdviser).map((a) => transformAdviserData(a.adviser))
    : []

export const transformOneListCoreTeamToCollection = (advisers) => {
  const mapAdviser = ({ adviser }) => {
    const adviserTeam = adviser.dit_team ?? adviser.ditTeam
    return {
      name: adviser.name,
      email: adviser.contactEmail,
      team: adviserTeam ? adviserTeam.name : '-',
      location: adviserTeam?.ukRegion
        ? adviserTeam?.ukRegion.name
        : adviserTeam?.country
        ? adviserTeam?.country.name
        : '-',
    }
  }

  const gam = advisers.filter(isAccountManager).map(mapAdviser)
  const teamMembers = advisers.filter(isAdviser).map(mapAdviser)

  return {
    gam,
    teamMembers,
  }
}
