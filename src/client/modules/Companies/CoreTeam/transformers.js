const isAccountManager = (adviser) => adviser.isGlobalAccountManager
const isAdviser = (adviser) => !adviser.isGlobalAccountManager

export const transformOneListCoreTeamToCollection = (advisers) => {
  const mapAdviser = ({ adviser }) => {
    const adviserTeam = adviser.ditTeam
    return {
      name: adviser.name,
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
