import React from 'react'

import { TASK_SAVE_ONE_LIST_DETAILS } from './state'
import {
  NONE,
  ACCOUNT_MANAGER_FIELD_NAME,
  ONE_LIST_TEAM_FIELD_NAME,
  TIER_FIELD_NAME,
} from './constants'
import {
  FieldAdvisersTypeahead,
  FieldRadios,
  Form,
  FormLayout,
  Step,
} from '../../../components'
import urls from '../../../../lib/urls'
import { FORM_LAYOUT } from '../../../../common/constants'

const EditOneListForm = ({
  company,
  oneListTiers,
  formInitialValues,
  returnUrl,
  userPermissions,
}) => (
  <Form
    id="edit-one-list"
    name={TASK_SAVE_ONE_LIST_DETAILS}
    initialValues={formInitialValues}
    submissionTaskName={TASK_SAVE_ONE_LIST_DETAILS}
    analyticsFormName="editOneList"
    transformPayload={(values) => ({
      values,
      companyId: company.id,
      userPermissions,
    })}
    redirectTo={() =>
      returnUrl ? returnUrl : urls.companies.businessDetails(company.id)
    }
    cancelRedirectTo={() =>
      returnUrl ? returnUrl : urls.companies.businessDetails(company.id)
    }
    flashMessage={() => 'Core team has been updated.'}
    showStepInUrl={true}
  >
    {({ values, currentStep, goToStep, permissions }) => (
      <>
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
              {permissions &&
                permissions.includes('company.change_company') &&
                permissions.includes(
                  'company.change_one_list_tier_and_global_account_manager'
                ) && (
                  <FieldAdvisersTypeahead
                    name={ACCOUNT_MANAGER_FIELD_NAME}
                    label="Global Account Manager"
                    required="Select at least one adviser"
                  />
                )}
              <FieldAdvisersTypeahead
                name={ONE_LIST_TEAM_FIELD_NAME}
                label="Advisers on the core team (optional)"
                isMulti={true}
              />
              <>
                {/* If there is a request to skip the first step, but company is missing a one list tier, 
                we need to force them back to the first step */}
                {currentStep === 1 &&
                  !values[TIER_FIELD_NAME] &&
                  !company.oneListGroupTier &&
                  goToStep('oneListTier')}
              </>
            </Step>
          </FormLayout>
        )}
      </>
    )}
  </Form>
)

export default EditOneListForm
