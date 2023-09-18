import React from 'react'
import { connect } from 'react-redux'

import { TASK_ARCHIVE_OBJECTIVE, state2props } from '../state'
import { FORM_LAYOUT } from '../../../../../common/constants'
import urls from '../../../../../lib/urls'
import { buildCompanyBreadcrumbs } from '../../utils'
import {
  DefaultLayout,
  Form,
  FormLayout,
  NewWindowLink,
} from '../../../../components'

const ObjectiveArchiveForm = ({ company, objectiveItem }) => {
  return (
    <DefaultLayout
      heading={'Are you sure you want to archive the objective?'}
      pageTitle={'Objective'}
      breadcrumbs={buildCompanyBreadcrumbs(
        [
          {
            link: urls.companies.accountManagement.index(company.id),
            text: 'Account management',
          },
          {
            text: 'Archive objective',
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
          analyticsFormName="createObjectiveArchiveForm"
          cancelRedirectTo={() =>
            urls.companies.accountManagement.objectives.edit(
              company.id,
              objectiveItem.id
            )
          }
          redirectTo={() => urls.companies.accountManagement.index(company.id)}
          submissionTaskName={TASK_ARCHIVE_OBJECTIVE}
          transformPayload={(values) => ({
            values,
            companyId: company.id,
            objective: objectiveItem,
          })}
          flashMessage={() => 'Objective archived'}
          submitButtonLabel="Archive objective"
          cancelButtonLabel="Back"
          initialValues={objectiveItem}
        >
          {() => (
            <>
              <p>Objective subject: {objectiveItem.subject}</p>
              {parseInt(objectiveItem.progress) !== 100 && (
                <p>
                  The objective is not yet complete. If the objective has been
                  achieved please use the back button to ensure the progress is
                  marked complete, at 100%.
                </p>
              )}
              <p>
                If you want to continue and archive the objective you will still
                be able to view this in the{' '}
                <NewWindowLink
                  href={urls.companies.accountManagement.objectives.archived(
                    company.id
                  )}
                >
                  company's archived objectives (opens in new tab)
                </NewWindowLink>
              </p>
            </>
          )}
        </Form>
      </FormLayout>
    </DefaultLayout>
  )
}

export default connect(state2props)(ObjectiveArchiveForm)
