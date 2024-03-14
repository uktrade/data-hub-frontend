import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout } from '../../../../../components'
import Task from '../../../../../components/Task'
import { RECIPIENT_COMPANY_ID, TASK_UPDATE_RECIPIENT_COMPANY } from './state'
import urls from '../../../../../../lib/urls'
import { InvestmentResource } from '../../../../../components/Resource'
import { checkIfRecipientCompanyExists } from './transformers'
import { buildProjectBreadcrumbs } from '../../../utils'

const checkIfUpdatingOrRemoving = (checkCompanyId, ukCompany) =>
  checkCompanyId
    ? checkIfRecipientCompanyExists(ukCompany)
    : 'Remove recipient company'

const EditRecipientCompany = () => {
  const { projectId, companyId } = useParams()
  return (
    <InvestmentResource id={projectId}>
      {(project) => (
        <DefaultLayout
          heading={checkIfUpdatingOrRemoving(companyId, project.ukCompany)}
          pageTitle={`${checkIfUpdatingOrRemoving(
            companyId,
            project.ukCompany
          )} - ${project.name} - Projects - Investments`}
          breadcrumbs={buildProjectBreadcrumbs([
            {
              link: urls.investments.projects.details(project.id),
              text: project.name,
            },
            {
              text: checkIfUpdatingOrRemoving(companyId, project.ukCompany),
            },
          ])}
          useReactRouter={false}
        >
          <Task.Status
            name={TASK_UPDATE_RECIPIENT_COMPANY}
            id={RECIPIENT_COMPANY_ID}
            progressMessage={
              companyId
                ? 'Setting recipient company'
                : 'Removing recipient company'
            }
            startOnRender={{
              payload: { projectId, companyId },
            }}
          >
            {() =>
              window.location.assign(
                urls.investments.projects.details(projectId)
              )
            }
          </Task.Status>
        </DefaultLayout>
      )}
    </InvestmentResource>
  )
}

export default EditRecipientCompany
