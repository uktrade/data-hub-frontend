import React from 'react'
import { useParams } from 'react-router-dom-v5-compat'

import {
  DefaultLayout,
  FieldSelect,
  FieldTextarea,
  FieldWrapper,
  Form,
  FormLayout,
} from '../../../../components'
import urls from '../../../../../lib/urls'
import FieldAddAnother from '../../../../components/Form/elements/FieldAddAnother'
import { TASK_ADD_PROJECT_DOCUMENT } from './state'
import { EvidenceTagResource } from '../../../../components/Resource'
import ResourceOptionsField from '../../../../components/Form/elements/ResourceOptionsField'
import { buildProjectBreadcrumbs } from '../../utils'
import { FORM_LAYOUT } from '../../../../../common/constants'
import FieldFileUpload from '../../../../components/Form/elements/FieldFileUpload'
import { transformEvidenceForApi } from './transformers'
import InvestmentName from '../InvestmentName'

const AddProjectDocument = () => {
  const { projectId } = useParams()

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
          link: urls.investments.projects.evidence.index(projectId),
          text: 'Evidence',
        },
        { text: 'Add evidence' },
      ])}
      useReactRouter={false}
    >
      <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
        <Form
          id="addInvestmentEvidence"
          cancelRedirectTo={() =>
            urls.investments.projects.evidence.index(projectId)
          }
          analyticsFormName="addInvestmentEvidence"
          submissionTaskName={TASK_ADD_PROJECT_DOCUMENT}
          submitButtonLabel="Upload"
          redirectTo={() => urls.investments.projects.evidence.index(projectId)}
          flashMessage={() => '1 File Uploaded'}
          transformPayload={(values) => ({
            projectId,
            values: transformEvidenceForApi(values),
          })}
        >
          <FieldFileUpload
            name="file_upload"
            required="Choose a document"
            label="Choose evidence document"
          />
          <FieldWrapper
            name="verification_criteria"
            legend="Verification criteria"
            showBorder={true}
          >
            <FieldAddAnother
              name="add_verifiction_criteria"
              itemName="verification criteria"
              dataTestPrefix="criteria_field_"
              buttonText="Add another"
              buttonMargin={0}
            >
              {({ groupIndex }) => (
                <ResourceOptionsField
                  id={`criteria_${groupIndex}`}
                  name={`criteria_${groupIndex}`}
                  emptyOption="-- Select criteria --"
                  required="Select a criteria"
                  fullWidth={true}
                  resource={EvidenceTagResource}
                  aria-label="verification criteria"
                  field={FieldSelect}
                />
              )}
            </FieldAddAnother>
          </FieldWrapper>
          <FieldTextarea
            type="text"
            name="comment"
            label="Comment (optional)"
          />
        </Form>
      </FormLayout>
    </DefaultLayout>
  )
}

export default AddProjectDocument
