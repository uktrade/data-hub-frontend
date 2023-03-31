import { isValid, parseISO } from 'date-fns'

const mapApiToField = ({ id, name }) => ({ value: id, label: name })

export const transformFormValuesForAPI = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_win_date,
}) => ({
  company,
  id,
  title,
  owner: owner.value,
  team_members: team_members.map((x) => x.value),
  estimated_win_date: `${estimated_win_date.year}-${estimated_win_date.month}-01T00:00:00`,
})

const convertDateToObject = (date) => {
  const parsedTime = parseISO(date)
  if (isValid(parsedTime)) {
    return {
      day: `${parsedTime.getDate()}`,
      month: `${parsedTime.getMonth() + 1}`, //getMonth is zero based
      year: `${parsedTime.getFullYear()}`,
    }
  }
  return date
}

export const transformAPIValuesForForm = ({
  company,
  id,
  title,
  owner,
  team_members,
  estimated_win_date,
}) => ({
  company: company.id,
  id,
  title,
  owner: mapApiToField(owner),
  team_members: team_members.map(mapApiToField),
  estimated_win_date: convertDateToObject(estimated_win_date),
})
