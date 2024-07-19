import React from 'react'
import { Button } from 'govuk-react'

import { TASK_SAVE_OBJECTIVE } from '../state'
import {
  FORM_LAYOUT,
  OPTIONS_YES_NO,
  OPTION_YES,
} from '../../../../../common/constants'
import {
  DefaultLayout,
  Form,
  FormLayout,
  FieldTextarea,
  FieldInput,
  FieldDate,
  FieldRadios,
  FormActions,
} from '../../../../components'
import urls from '../../../../../lib/urls'
import { buildCompanyBreadcrumbs } from '../../utils'
import { GREY_3, TEXT_COLOUR } from '../../../../utils/colours'

const ButtonSecondary = (props) => (
  <Button buttonColour={GREY_3} buttonTextColour={TEXT_COLOUR} {...props} />
)

const ObjectiveForm = ({ company, objectiveItem }) => {
  const OBJECTIVE_PERCENTAGE = [
    {
      label: '0%',
      value: '0',
    },
    {
      label: '25%',
      value: '25',
    },
    {
      label: '50%',
      value: '50',
    },
    {
      label: '75%',
      value: '75',
    },
    {
      label: '100% - objective complete',
      value: '100',
    },
  ]

  return (
    <DefaultLayout
      heading={
        objectiveItem
          ? `Edit objective for ${company.name}`
          : `Add objective for ${company.name}`
      }
      pageTitle={'Objective'}
      breadcrumbs={buildCompanyBreadcrumbs(
        [
          {
            link: urls.companies.accountManagement.index(company.id),
            text: 'Account management',
          },
          {
            text: objectiveItem
              ? `Edit ${objectiveItem.subject}`
              : `Add objective for ${company.name}`,
          },
        ],
        company.id,
        company.name
      )}
      useReactRouter={false}
    >
      <FormLayout setWidth={FORM_LAYOUT.THREE_QUARTERS}>
        <Form
          id="objective-form"
          analyticsFormName="createObjectiveForm"
          cancelRedirectTo={() =>
            urls.companies.accountManagement.index(company.id)
          }
          redirectTo={() => urls.companies.accountManagement.index(company.id)}
          submissionTaskName={TASK_SAVE_OBJECTIVE}
          transformPayload={(values) => ({
            values,
            companyId: company.id,
            objective: objectiveItem,
          })}
          flashMessage={() => 'Objective saved'}
          submitButtonLabel="Save objective"
          cancelButtonLabel="Back"
          initialValues={objectiveItem}
        >
          {() => (
            <>
              <FieldInput
                type="text"
                name="subject"
                label="Objective subject"
                required="Enter an objective subject"
                hint="This should be concise, specific, measurable, and aligned with the strategy"
              />
              <FieldTextarea
                name="detail"
                label="Objective detail (optional)"
                hint="Provide more context and rationale for the objective. What does it aim to accomplish? How do we aim to help them achieve it?"
                data-test="detail-input"
              />
              <FieldDate
                name="target_date"
                label="Target date"
                invalid="Enter a valid target date"
                required="Enter a target date"
              />
              <FieldRadios
                name="has_blocker"
                legend="Are there any blockers to achieving this objective?"
                required="Select if there are any blockers"
                options={OPTIONS_YES_NO.map((option) => ({
                  ...option,
                  ...(option.value === OPTION_YES && {
                    children: (
                      <FieldTextarea
                        name="blocker_description"
                        label="Blocker description"
                      />
                    ),
                  }),
                }))}
              />
              <FieldRadios
                name="progress"
                legend="How close are we to achieving this objective at the moment?"
                required="Select a percentage"
                options={OBJECTIVE_PERCENTAGE}
              />
            </>
          )}
        </Form>
        {objectiveItem && (
          <FormActions>
            <ButtonSecondary
              as={'a'}
              href={urls.companies.accountManagement.objectives.archive(
                company?.id,
                objectiveItem?.id
              )}
              data-test="archive-objective"
            >
              Archive objective
            </ButtonSecondary>
          </FormActions>
        )}
      </FormLayout>
    </DefaultLayout>
  )
}

export default ObjectiveForm
