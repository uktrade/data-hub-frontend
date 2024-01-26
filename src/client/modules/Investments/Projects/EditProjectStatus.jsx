import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'

import { DefaultLayout, FieldRadios, Form } from '../../../components'
import { InvestmentResource } from '../../../components/Resource'
import urls from '../../../../lib/urls'
import { TASK_EDIT_INVESTMENT_PROJECT_STATUS } from './state'
import { investmentProjectStatuses } from './constants'
import { transformProjectStatusForApi } from './transformers'
import { buildProjectBreadcrumbs } from '../utils'
import InvestmentName from './InvestmentName'

const EditProjectStatus = () => {
  const { projectId } = useParams()
  return (
    <DefaultLayout
      heading={'Change project status'}
      pageTitle={
        <>
          Change project status - <InvestmentName id={projectId} /> - Projects -
          Investments
        </>
      }
      breadcrumbs={buildProjectBreadcrumbs([
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        { text: 'Change project status' },
      ])}
      useReactRouter={false}
    >
      <InvestmentResource id={projectId}>
        {(project) => (
          <Form
            id="edit-project-status"
            analyticsFormName="editInvestmentProjectStatus"
            cancelButtonLabel="Back"
            cancelRedirectTo={() =>
              urls.investments.projects.details(project.id)
            }
            flashMessage={() => 'Investment status updated'}
            submitButtonlabel="Save"
            redirectTo={() => urls.investments.projects.details(project.id)}
            submissionTaskName={TASK_EDIT_INVESTMENT_PROJECT_STATUS}
            transformPayload={(values) =>
              transformProjectStatusForApi({
                project,
                values,
              })
            }
          >
            <FieldRadios
              name="status"
              initialValue={project.status}
              options={investmentProjectStatuses.map((option) => ({
                ...option,
              }))}
            />
          </Form>
        )}
      </InvestmentResource>
    </DefaultLayout>
  )
}

EditProjectStatus.propTypes = {
  changeMe: PropTypes.string.isRequired,
}

export default EditProjectStatus
