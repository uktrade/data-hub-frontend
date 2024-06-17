import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { H2 } from 'govuk-react'
import { LEVEL_SIZE } from '@govuk-react/constants'
import { useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import { Form } from '../../../../components'
import { InvestmentResource } from '../../../../components/Resource'
import urls from '../../../../../lib/urls'
import { transformProjectSummaryForApi } from './transformers'
import { state2props, TASK_EDIT_INVESTMENT_PROJECT_SUMMARY } from './state'
import ProjectLayoutNew from '../../../../components/Layout/ProjectLayoutNew'
import InvestmentName from '../InvestmentName'
import EditProjectSummaryInitialStep from './EditProjectSummaryInitialStep'
import ConfirmFDITypeChangeStep from './EditProjectSummaryConfirmationStep'
import { FDI_TYPES } from '../constants'

const EditProjectSummary = ({ currentAdviserId, autoScroll }) => {
  const { projectId } = useParams()
  const [selectedFDIType, setSelectedFDIType] = useState(null)
  const cancelButtonLabel = 'Back'
  const cancelRedirectTo = urls.investments.projects.details(projectId)
  return (
    <ProjectLayoutNew
      projectId={projectId}
      breadcrumbs={[
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Edit details' },
      ]}
      pageTitle="Edit details"
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <>
            <H2 size={LEVEL_SIZE[3]}>Update investment project summary</H2>
            <Form
              id="edit-project-summary"
              analyticsFormName="editInvestmentProjectSummary"
              flashMessage={() => 'Investment details updated'}
              submitButtonlabel="Save"
              redirectTo={() => urls.investments.projects.details(project.id)}
              submissionTaskName={TASK_EDIT_INVESTMENT_PROJECT_SUMMARY}
              keepValuesOnDeregister={true}
              transformPayload={(values) => {
                return transformProjectSummaryForApi({
                  projectId,
                  currentAdviserId,
                  values,
                })
              }}
            >
              <EditProjectSummaryInitialStep
                project={project}
                currentAdviserId={currentAdviserId}
                setSelectedFDIType={setSelectedFDIType}
                selectedFDIType={selectedFDIType}
                autoScroll={autoScroll}
                backButton={cancelButtonLabel}
                cancelUrl={cancelRedirectTo}
              />
              {selectedFDIType?.value === FDI_TYPES.capitalOnly.value ? (
                <ConfirmFDITypeChangeStep project={project} />
              ) : null}
            </Form>
          </>
        )}
      </InvestmentResource>
    </ProjectLayoutNew>
  )
}

EditProjectSummary.propTypes = {
  currentAdviserId: PropTypes.string.isRequired,
}

export default connect(state2props)(EditProjectSummary)
