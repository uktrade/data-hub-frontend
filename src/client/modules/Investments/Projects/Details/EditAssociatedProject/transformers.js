import urls from '../../../../../../lib/urls'
import { format } from '../../../../../utils/date'

export const checkIfAssociatedProjectExists = (hasAssociatedProject) =>
  hasAssociatedProject ? 'Update associated project' : 'Add associated project'

const transformNonFdiProjectToListItem = (projectId) => (project) => {
  const {
    id,
    name,
    project_code,
    stage,
    investment_type,
    status,
    investor_company,
    estimated_land_date,
    sector,
  } = project

  const badges = [
    { text: stage.name },
    { text: investment_type.name },
    { text: status },
  ]

  const metadata = [
    { label: 'Investor', value: investor_company.name },
    { label: 'Sector', value: sector ? sector.name : '' },
    {
      label: 'Estimated land date',
      value: estimated_land_date && format(estimated_land_date, 'MMMM yyyy'),
    },
  ].filter((metadata) => metadata.value)

  return {
    id,
    headingUrl: urls.investments.projects.editAssociatedProject(projectId, id),
    headingText: name,
    subheading: `Project code ${project_code}`,
    badges,
    metadata,
  }
}

export const transformNonFdiResponseToCollection = (
  { count, results = [] },
  projectId
) => ({
  count,
  results: results.map(transformNonFdiProjectToListItem(projectId)),
})
