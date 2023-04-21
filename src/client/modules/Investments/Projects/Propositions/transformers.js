import { transformValueForAPI } from '../../../../utils/date'

export const buildPropositionUrl = (propositionId, projectId) =>
  `v3/investment/${projectId}/proposition/${propositionId}`

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

export const transformAbandonedPropositionForAPI = ({
  investmentProjectId,
  propositionId,
  values,
}) => {
  return {
    propositionId,
    investmentProjectId,
    details: values.reason,
  }
}
