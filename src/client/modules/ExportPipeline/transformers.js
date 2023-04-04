const mapApiToField = ({ id, name }) => ({ value: id, label: name })

export const transformFormValuesForAPI = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_export_value_years,
  estimated_export_value_amount,
  destination_country,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  estimated_export_value_years,
  estimated_export_value_amount,
  destination_country: destination_country.value,
})

export const transformAPIValuesForForm = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_export_value_years,
  estimated_export_value_amount,
  destination_country,
}) => ({
  company: company.id,
  id,
  title,
  owner: mapApiToField(owner),
  team_members: team_members.map(mapApiToField),
  estimated_export_value_years: estimated_export_value_years.id,
  estimated_export_value_amount: estimated_export_value_amount,
  destination_country:
    destination_country && mapApiToField(destination_country),
})
