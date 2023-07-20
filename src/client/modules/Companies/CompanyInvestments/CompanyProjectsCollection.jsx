import React from 'react'
import { connect } from 'react-redux'

import CompanyLayout from '../../../components/Layout/CompanyLayout'
import ProjectsCollection from '../../../../apps/investments/client/projects/ProjectsCollection'
import { projectsState2props } from '../../../../apps/investments/client/projects/state'

const CompanyProjectsCollection = ({
  company,
  dnbRelatedCompaniesCount,
  returnUrl,
  localNavItems,
  ...props
}) => (
  <CompanyLayout
    company={company}
    breadcrumbs={[{ text: 'Investment' }]}
    dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
    returnUrl={returnUrl}
    localNavItems={localNavItems}
    isInvestment={true}
  >
    <ProjectsCollection company={company} {...props} />
  </CompanyLayout>
)

export default connect(projectsState2props)(CompanyProjectsCollection)
