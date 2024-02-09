import React from 'react'
import { useParams } from 'react-router-dom'
import { FileUpload } from 'govuk-react'

import {
  DefaultLayout,
  FieldSelect,
  FieldTextarea,
  FieldWrapper,
  Form,
  FormLayout,
} from '../../../../components/index.jsx'
import urls from '../../../../../lib/urls.js'
import FieldAddAnother from '../../../../components/Form/elements/FieldAddAnother/index.jsx'
import { TASK_ADD_PROJECT_DOCUMENT } from './state.js'
import {
  EvidenceTagResource,
  InvestmentResource,
} from '../../../../components/Resource/index.jsx'
import ResourceOptionsField from '../../../../components/Form/elements/ResourceOptionsField/index.jsx'
import { buildProjectBreadcrumbs } from '../../utils.js'
import { FORM_LAYOUT } from '../../../../../common/constants.js'

const InvestmentName = (props) => (
  <InvestmentResource.Inline {...props}>
    {(project) => project.name}
  </InvestmentResource.Inline>
)

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
        >
          <FileUpload />
          <FieldWrapper
            name="verification-criteria"
            legend="Verifiation criteria"
            showBorder={true}
          >
            <FieldAddAnother
              name="add-verifiction-criteria"
              itemName="verification criteria"
              dataTestPrefix="criteria-field-"
              buttonText="Add another"
              buttonMargin={0}
            >
              {({ groupIndex }) => (
                <ResourceOptionsField
                  id={`criteria-${groupIndex}`}
                  name={`criteria-${groupIndex}`}
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
