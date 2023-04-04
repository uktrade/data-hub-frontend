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
  estimated_export_value_years,
  estimated_export_value_amount,
  destination_country,
  sector,
  notes,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  estimated_export_value_years,
  estimated_export_value_amount,
  destination_country: destination_country.value,
  sector: sector.value,
  notes,
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
  sector,
  notes,
}) => ({
  company: company.id,
  id,
  title,
  owner: transformIdNameToValueLabel(owner),
  team_members: transformArrayIdNameToValueLabel(team_members),
  estimated_export_value_years: estimated_export_value_years.id,
  estimated_export_value_amount: estimated_export_value_amount,
  destination_country:
    destination_country && transformIdNameToValueLabel(destination_country),
  sector: sector && transformIdNameToValueLabel(sector),
  notes,
})
