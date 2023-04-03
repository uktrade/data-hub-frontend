const mapApiToField = ({ id, name }) => ({ value: id, label: name })

export const transformFormValuesForAPI = ({
  company,
  id,
  title,
  owner,
  team_members,
  sector,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  sector: sector.value,
})

export const transformAPIValuesForForm = ({
  company,
  id,
  title,
  owner,
  team_members,
  sector,
}) => ({
  company: company.id,
  id,
  title,
  owner: mapApiToField(owner),
  team_members: team_members.map(mapApiToField),
  sector: sector && mapApiToField(sector),
})
