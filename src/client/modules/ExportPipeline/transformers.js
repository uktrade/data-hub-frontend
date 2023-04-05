import {
  transformArrayIdNameToValueLabel,
  transformIdNameToValueLabel,
} from '../../transformers'
import { convertDateToFieldDateObject } from '../../utils/date'

export const transformFormValuesForAPI = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_export_value_years,
  estimated_export_value_amount,
  estimated_win_date,
  destination_country,
  exporter_experience,
  notes,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  estimated_export_value_years,
  estimated_export_value_amount,
  estimated_win_date: `${estimated_win_date.year}-${estimated_win_date.month}-01T00:00:00`,
  destination_country: destination_country.value,
  exporter_experience,
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
  estimated_win_date,
  destination_country,
  exporter_experience,
  notes,
}) => ({
  company: company.id,
  id,
  title,
  owner: transformIdNameToValueLabel(owner),
  team_members: transformArrayIdNameToValueLabel(team_members),
  estimated_export_value_years: estimated_export_value_years.id,
  estimated_export_value_amount: estimated_export_value_amount,
  estimated_win_date: convertDateToFieldDateObject(estimated_win_date),
  destination_country:
    destination_country && transformIdNameToValueLabel(destination_country),
  exporter_experience: exporter_experience.id,
  notes,
})
