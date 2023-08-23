import React from 'react'
import PropTypes from 'prop-types'

import LocalHeader from '../../../../../client/components/LocalHeader/LocalHeader'
import urls from '../../../../../lib/urls'
import {
  Main,
  FieldRadios,
  Step,
  FieldAdvisersTypeahead,
  FormLayout,
} from '../../../../../client/components'
import Form from '../../../../../client/components/Form'
import { TASK_SAVE_ONE_LIST_DETAILS } from './state'

import {
  NONE,
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from '../constants'
import { FORM_LAYOUT } from '../../../../../common/constants'

function EditOneListForm({
  companyId,
  companyName,
  oneListTiers,
  formInitialValues,
  returnUrl,
}) {
  return (
    <Form
      id="edit-one-list"
      name={TASK_SAVE_ONE_LIST_DETAILS}
      initialValues={formInitialValues}
      submissionTaskName={TASK_SAVE_ONE_LIST_DETAILS}
      analyticsFormName="editOneList"
      transformPayload={(values) => ({ values, companyId })}
      redirectTo={() =>
        returnUrl ? returnUrl : urls.companies.businessDetails(companyId)
      }
      flashMessage={() => 'One List information has been updated.'}
      showStepInUrl={true}
    >
      {({ values }) => (
        <>
          <LocalHeader
            heading={`Add or edit ${companyName} One List information`}
            breadcrumbs={[
              { link: urls.dashboard.index(), text: 'Home' },
              {
                link: urls.companies.index(),
                text: 'Companies',
              },
              { link: urls.companies.detail(companyId), text: companyName },
              { text: 'Edit One List information' },
            ]}
          />
          <Main>
            {/* if there is a request to skip the first step, but company is missing a one list tier, need to show the first step */}

            <Step name="oneListTier">
              <FieldRadios
                label="Company One List tier"
                name={TIER_FIELD_NAME}
                options={oneListTiers}
                required="Select a company One List tier"
              />
            </Step>

            {values.one_list_tier !== NONE && (
              <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
                <Step name="oneListAdvisers">
                  <FieldAdvisersTypeahead
                    name={ACCOUNT_MANAGER_FIELD_NAME}
                    label="Global Account Manager"
                    required="Select at least one adviser"
                  />
                  <FieldAdvisersTypeahead
                    name={ONE_LIST_TEAM_FIELD_NAME}
                    label="Advisers on the core team (optional)"
                    isMulti={true}
                  />
                </Step>
              </FormLayout>
            )}
          </Main>
        </>
      )}
    </Form>
  )
}

EditOneListForm.propTypes = {
  companyId: PropTypes.string.isRequired,
  companyName: PropTypes.string.isRequired,
  oneListTiers: PropTypes.array.isRequired,
  formInitialValues: PropTypes.object.isRequired,
}

export default EditOneListForm
