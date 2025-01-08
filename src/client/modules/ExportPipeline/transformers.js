import {
  transformArrayIdNameToValueLabel,
  transformIdNameToValueLabel,
} from '../../transformers'
import { isoStringToDateParts } from '../../utils/date'

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
  sector,
  status,
  export_potential,
  contacts,
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
  estimated_win_date: `${estimated_win_date.year}-${estimated_win_date.month}-01`,
  destination_country: destination_country.value,
  sector: sector.value,
  status,
  export_potential,
  contacts: contacts.map((x) => x.value),
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
  sector,
  status,
  export_potential,
  contacts,
  exporter_experience,
  notes,
}) => ({
  company: { id: company.id, name: company.name },
  id,
  title,
  owner: owner && transformIdNameToValueLabel(owner),
  team_members: transformArrayIdNameToValueLabel(team_members),
  estimated_export_value_years: estimated_export_value_years?.id,
  estimated_export_value_amount: estimated_export_value_amount,
  estimated_win_date: isoStringToDateParts(estimated_win_date),
  destination_country:
    destination_country && transformIdNameToValueLabel(destination_country),
  sector: sector && transformIdNameToValueLabel(sector),
  status,
  export_potential,
  contacts: transformArrayIdNameToValueLabel(contacts),
  exporter_experience: exporter_experience?.id,
  notes,
})

export const transformAPIAdvisersToOptions = ({ data }) =>
  data.map((adviser) => ({
    label: adviser.name,
    value: adviser.id,
  }))
