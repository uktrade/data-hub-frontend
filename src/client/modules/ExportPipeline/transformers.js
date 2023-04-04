import {
  transformArrayIdNameToValueLabel,
  transformIdNameToValueLabel,
} from '../../transformers'

export const transformFormValuesForAPI = ({
  company,
  id,
  title,
  owner,
  team_members,
  destination_country,
  notes,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  destination_country: destination_country.value,
  notes,
})

export const transformAPIValuesForForm = ({
  company,
  id,
  title,
  owner,
  team_members,
  destination_country,
  notes,
}) => ({
  company: company.id,
  id,
  title,
  owner: transformIdNameToValueLabel(owner),
  team_members: transformArrayIdNameToValueLabel(team_members),
  destination_country:
    destination_country && transformIdNameToValueLabel(destination_country),
  notes,
})
