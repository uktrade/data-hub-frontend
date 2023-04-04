import { convertDateToFieldDateObject } from '../../utils/date'

const mapApiToField = ({ id, name }) => ({ value: id, label: name })

export const transformFormValuesForAPI = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_win_date,
  destination_country,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  estimated_win_date: `${estimated_win_date.year}-${estimated_win_date.month}-01T00:00:00`,
  destination_country: destination_country.value,
})

export const transformAPIValuesForForm = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_win_date,
  destination_country,
}) => ({
  company: company.id,
  id,
  title,
  owner: mapApiToField(owner),
  team_members: team_members.map(mapApiToField),
  estimated_win_date: convertDateToFieldDateObject(estimated_win_date),
  destination_country:
    destination_country && mapApiToField(destination_country),
})
