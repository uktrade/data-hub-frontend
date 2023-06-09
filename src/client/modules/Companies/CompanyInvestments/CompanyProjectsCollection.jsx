import React from 'react'
import { connect } from 'react-redux'

import { CompanyResource } from '../../../components/Resource'
import CompanyLayout from '../../../components/Layout/CompanyLayout'
import ProjectsCollection from '../../../../apps/investments/client/projects/ProjectsCollection'
import { projectsState2props } from '../../../../apps/investments/client/projects/state'

const CompanyProjectsCollection = ({
  companyId,
  dnbRelatedCompaniesCount,
  returnUrl,
  localNavItems,
  ...props
}) => (
  <CompanyResource id={companyId}>
    {(company) => (
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
    )}
  </CompanyResource>
)

export default connect(projectsState2props)(CompanyProjectsCollection)
