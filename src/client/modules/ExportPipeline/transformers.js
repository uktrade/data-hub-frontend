const mapApiToField = ({ id, name }) => ({ value: id, label: name })

export const transformFormValuesForAPI = ({
  company,
  id,
  title,
  owner,
  team_members,
  destination_country,
  exporter_experience,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  destination_country: destination_country.value,
  exporter_experience: exporter_experience.value,
})

export const transformAPIValuesForForm = ({
  company,
  id,
  title,
  owner,
  team_members,
  destination_country,
  exporter_experience,
}) => ({
  company: company.id,
  id,
  title,
  owner: mapApiToField(owner),
  team_members: team_members.map(mapApiToField),
  destination_country:
    destination_country && mapApiToField(destination_country),
  exporter_experience:
    exporter_experience && mapApiToField(exporter_experience),
})
