import React from 'react'
import PropTypes from 'prop-types'

import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import { companies, dashboard } from '../../../../../lib/urls'
import {
  Main,
  FieldRadios,
  Step,
  AdviserTypeAhead,
} from '../../../../../client/components'
import TaskForm from '../../../../../client/components/Task/Form'
import { TASK_SAVE_ONE_LIST_DETAILS } from './state'

import {
  NONE,
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from '../constants'

function EditOneListForm({
  companyId,
  companyName,
  oneListTiers,
  formInitialValues,
}) {
  return (
    <TaskForm
      id="edit-one-list"
      name={TASK_SAVE_ONE_LIST_DETAILS}
      initialValues={formInitialValues}
      submissionTaskName={TASK_SAVE_ONE_LIST_DETAILS}
      analyticsFormName="editOneList"
      transformPayload={(values) => ({ values, companyId })}
      redirectTo={() => companies.businessDetails(companyId)}
      flashMessage={() => 'One List information has been updated.'}
    >
      {({ values }) => (
        <>
          <LocalHeader
            heading={`Add or edit ${companyName} One List information`}
            breadcrumbs={[
              { link: dashboard(), text: 'Home' },
              {
                link: companies.index(),
                text: 'Companies',
              },
              { link: companies.detail(companyId), text: companyName },
              { text: 'Edit One List information' },
            ]}
          />
          <Main>
            <Step name="oneListTier">
              <FieldRadios
                label="Company One List tier"
                name={TIER_FIELD_NAME}
                options={oneListTiers}
                required="Select a company One List tier"
              />
            </Step>

            {values.one_list_tier !== NONE && (
              <Step name="oneListAdvisers">
                <AdviserTypeAhead
                  name={ACCOUNT_MANAGER_FIELD_NAME}
                  label="Global Account Manager"
                  required="Select at least one adviser"
                />
                <AdviserTypeAhead
                  name={ONE_LIST_TEAM_FIELD_NAME}
                  label="Advisers on the core team (optional)"
                  isMulti={true}
                />
              </Step>
            )}
          </Main>
        </>
      )}
    </TaskForm>
  )
}

EditOneListForm.propTypes = {
  companyId: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  oneListTiers: PropTypes.array.isRequired,
  formInitialValues: PropTypes.object.isRequired,
}

export default EditOneListForm
