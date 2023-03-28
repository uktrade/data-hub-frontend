const mapApiToField = ({ id, name }) => ({ value: id, label: name })

export const transformFormValuesForAPI = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_export_value_years,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  estimated_export_value_years: estimated_export_value_years.value,
})

export const transformAPIValuesForForm = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_export_value_years,
}) => ({
  company: company.id,
  id,
  title,
  owner: mapApiToField(owner),
  team_members: team_members.map(mapApiToField),
  estimated_export_value_years: mapApiToField(estimated_export_value_years),
})
