import { transformValueForAPI } from '../../../../utils/date'

export const transformPropositionForAPI = ({ projectId, values }) => {
  const {
    proposition_name,
    proposition_scope,
    proposition_assignee,
    proposition_deadline,
  } = values

  return {
    investment_project: projectId,
    name: proposition_name,
    scope: proposition_scope,
    adviser: proposition_assignee.value,
    deadline_day: proposition_deadline.day,
    deadline_month: proposition_deadline.month,
    deadline_year: proposition_deadline.year,
    deadline: transformValueForAPI(proposition_deadline),
  }
}
