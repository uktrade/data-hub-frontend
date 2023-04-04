import React from 'react'
import PropTypes from 'prop-types'

import Form from '../../../components/Form'
import {
  FieldInput,
  FormLayout,
  FieldAdvisersTypeahead,
  FieldRadios,
} from '../../../../client/components'
import { FORM_LAYOUT } from '../../../../common/constants'
import { TASK_SAVE_EXPORT } from './state'
import Task from '../../../components/Task'
import { ERROR_MESSAGES } from './constants'
import { transformAPIValuesForForm } from '../transformers'
import { validateTeamMembers } from './validation'
import ResourceOptionsField from '../../../components/Form/elements/ResourceOptionsField'
import ExportExperience from '../../../components/Resource/ExportExperience'

const ExportFormFields = ({
  initialValues,
  analyticsFormName,
  flashMessage,
  cancelRedirectUrl,
  redirectToUrl,
  formDataLoaded,
  taskProps = {},
}) => (
  <Task.Status {...taskProps}>
    {() =>
      formDataLoaded && (
        <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
          <Form
            id="export-form"
            analyticsFormName={analyticsFormName}
            cancelRedirectTo={() => cancelRedirectUrl}
            redirectTo={() => redirectToUrl}
            submissionTaskName={TASK_SAVE_EXPORT}
            initialValues={
              initialValues && transformAPIValuesForForm(initialValues)
            }
            transformPayload={(values) => ({ exportId: values.id, values })}
            flashMessage={flashMessage}
          >
            {() => (
              <>
                <FieldInput
                  name="title"
                  label="Export title"
                  hint="It helps to give export details in the title, for example product and destination"
                  type="text"
                  required={ERROR_MESSAGES.title}
                />
                <FieldAdvisersTypeahead
                  name="owner"
                  label="Owner"
                  hint="When creating the record your name will appear. You can change the name to transfer ownership to someone else"
                  required={ERROR_MESSAGES.owner}
                />
                <FieldAdvisersTypeahead
                  name="team_members"
                  label="Team members (optional)"
                  hint="You can add up to 5 team members. Team members can view and edit export functionality"
                  isMulti={true}
                  validate={validateTeamMembers}
                />
                <ResourceOptionsField
                  resource={ExportExperience}
                  field={FieldRadios}
                  name="exporter_experience"
                  label="Exporter experience (optional)"
                />
              </>
            )}
          </Form>
        </FormLayout>
      )
    }
  </Task.Status>
)

ExportFormFields.propTypes = {
  initialValues: PropTypes.object,
  analyticsFormName: PropTypes.string.isRequired,
  flashMessage: PropTypes.func.isRequired,
  cancelRedirectUrl: PropTypes.string.isRequired,
  redirectToUrl: PropTypes.string.isRequired,
  taskProps: PropTypes.object,
  formDataLoaded: PropTypes.bool,
}

ExportFormFields.defaultProps = {
  formDataLoaded: false,
}

export default ExportFormFields
