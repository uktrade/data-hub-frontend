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
  exporter_experience: exporter_experience.value,
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
    destination_country && mapApiToField(destination_country),
  exporter_experience:
    exporter_experience && mapApiToField(exporter_experience),
})
