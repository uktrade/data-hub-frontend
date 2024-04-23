import React from 'react'
import { useParams } from 'react-router-dom'

import { DefaultLayout, Form, FormLayout } from '../../../../components'
import urls from '../../../../../lib/urls'
import { TASK_ADD_PROPOSITION_DOCUMENT } from './state'
import { buildProjectBreadcrumbs } from '../../utils'
import { FORM_LAYOUT } from '../../../../../common/constants'
import FieldFileUpload from '../../../../components/Form/elements/FieldFileUpload'
import InvestmentName from '../InvestmentName'
import PropositionName from './PropositionName'
import {
  buildPropositionUrl,
  transformPropositionEvidenceForApi,
} from './transformers'

const AddPropositionDocument = () => {
  const { projectId, propositionId } = useParams()

  return (
    <DefaultLayout
      heading="Add evidence"
      pageTitle={
        <>
          Add evidence - <InvestmentName id={projectId} /> - Projects -
          Investments
        </>
      }
      breadcrumbs={buildProjectBreadcrumbs([
        {
          link: urls.investments.projects.details(projectId),
          text: <InvestmentName id={projectId} />,
        },
        {
          link: urls.investments.projects.proposition.details(
            projectId,
            propositionId
          ),
          text: (
            <PropositionName
              id={buildPropositionUrl(propositionId, projectId)}
            />
          ),
        },
        { text: 'Add evidence' },
      ])}
      useReactRouter={false}
    >
      <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
        <Form
          id="addPropositionEvidence"
          cancelRedirectTo={() =>
            urls.investments.projects.proposition.details(
              projectId,
              propositionId
            )
          }
          analyticsFormName="addPropositionEvidence"
          submissionTaskName={TASK_ADD_PROPOSITION_DOCUMENT}
          submitButtonLabel="Upload"
          redirectTo={() =>
            urls.investments.projects.proposition.details(
              projectId,
              propositionId
            )
          }
          flashMessage={() => 'File uploaded'}
          transformPayload={(values) => ({
            projectId,
            propositionId,
            values: transformPropositionEvidenceForApi(values),
          })}
        >
          <FieldFileUpload
            name="document_upload"
            required="Choose a document"
            label="Choose evidence document"
          />
        </Form>
      </FormLayout>
    </DefaultLayout>
  )
}

export default AddPropositionDocument
