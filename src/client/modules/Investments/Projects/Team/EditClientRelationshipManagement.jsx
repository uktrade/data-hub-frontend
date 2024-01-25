import React from 'react'
import styled from 'styled-components'
import { FONT_WEIGHTS } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'

import { Form } from '../../../../components'
import FieldAdvisersTypeahead from '../../../../components/Form/elements/FieldAdvisersTypeahead'
import urls from '../../../../../lib/urls'
import { TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER } from './state'
import GlobalAccountManagerDetails from './GlobalAccountManagerDetails'
import { InvestmentResource } from '../../../../components/Resource'
import { ONE_LIST_EMAIL } from '../../../Companies/AccountManagement/constants'
import { transformObjectForTypeahead } from '../transformers'
import { transformAdviserForAPI } from './transformers'
import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew'
import InvestmentName from '../InvestmentName'

const StyledLegend = styled('legend')`
  font-weight: ${FONT_WEIGHTS.bold};
  margin-bottom: 20px;
  font-size: 24px;
`

const EditClientRelationshipManagement = () => {
  const { projectId } = useParams()
  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        {
          link: urls.investments.projects.team(projectId),
          text: 'Project team',
        },
        { text: 'Client relationship management' },
      ]}
      pageTitle="Client relationship management"
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <>
            <Form
              id="edit-client-relationship-management-form"
              analyticsFormName="editClientRelationshipManagement"
              redirectTo={() => urls.investments.projects.team(project.id)}
              flashMessage={() => 'Investment details updated'}
              cancelButtonLabel="Back"
              cancelRedirectTo={() =>
                urls.investments.projects.team(project.id)
              }
              initialValues={{
                client_relationship_manager: transformObjectForTypeahead(
                  project.clientRelationshipManager
                ),
              }}
              submissionTaskName={TASK_SAVE_CLIENT_RELATIONSHIP_MANAGER}
              transformPayload={(values) => ({
                id: project.id,
                client_relationship_manager: transformAdviserForAPI(
                  values.client_relationship_manager
                ),
              })}
            >
              <StyledLegend>Edit client relationship management</StyledLegend>
              <FieldAdvisersTypeahead
                name="client_relationship_manager"
                label="Client Relationship Manager"
                placeholder="Search client relationship manager"
                required="Enter a client relationship manager"
              />
              <GlobalAccountManagerDetails
                oneListEmail={ONE_LIST_EMAIL}
                companyId={project.investorCompany.id}
              />
            </Form>
          </>
        )}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

export default EditClientRelationshipManagement
