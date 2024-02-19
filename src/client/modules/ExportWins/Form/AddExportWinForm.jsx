import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { DefaultLayout, Form, FormLayout } from '../../../components'
import { CompanyResource } from '../../../components/Resource'
import { transformFormValuesForAPI } from './transformers'
import urls from '../../../../lib/urls'
import {
  state2props,
  TASK_GET_EXPORT_WIN,
  TASK_GET_EXPORT_PROJECT,
  TASK_GET_EXPORT_WINS_SAVE_FORM,
} from './state'
import OfficerDetailsStep from './OfficerDetailsStep'
import CreditForThisWinStep from './CreditForThisWinStep'
import CustomerDetailsStep from './CustomerDetailsStep'
import WinDetailsStep from './WinDetailsStep'
import SupportProvidedStep from './SupportProvidedStep'
import CheckBeforeSendingStep from './CheckBeforeSendingStep'

const CompanyName = ({ companyId }) => (
  <CompanyResource.Inline id={companyId}>
    {(company) => company.name.toUpperCase()}
  </CompanyResource.Inline>
)

const AddExportWinForm = ({ isEditing, csrfToken, currentAdviserId }) => {
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)
  const companyId = queryParams.company
  const stepProps = { isEditing }

  const initialValuesTaskName = queryParams.export
    ? TASK_GET_EXPORT_PROJECT
    : queryParams.exportwin
      ? TASK_GET_EXPORT_WIN
      : null

  return (
    <DefaultLayout
      heading="Add export win"
      pageTitle="Add export win"
      subheading={<CompanyName companyId={companyId} />}
      breadcrumbs={[
        {
          link: urls.dashboard.index(),
          text: 'Home',
        },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        {
          link: urls.companies.detail(companyId),
          text: <CompanyName companyId={companyId} />,
        },
        { text: 'Add export win' },
      ]}
    >
      <FormLayout>
        <Form
          id="add-export-win"
          showStepInUrl={true}
          cancelRedirectTo={() => urls.companies.exportWins.unconfirmed()}
          redirectTo={() => urls.companies.exportWins.unconfirmed()}
          analyticsFormName="addExportWin"
          submissionTaskName={TASK_GET_EXPORT_WINS_SAVE_FORM}
          initialValuesTaskName={initialValuesTaskName}
          transformPayload={(values) => ({
            exportWinId: queryParams.exportwin,
            payload: {
              ...transformFormValuesForAPI(values),
              company: companyId,
              _csrf: csrfToken,
              adviser: currentAdviserId,
            },
          })}
          initialValuesPayload={{
            id: queryParams.export || queryParams.exportwin,
          }}
        >
          <>
            <OfficerDetailsStep {...stepProps} />
            <CreditForThisWinStep {...stepProps} />
            <CustomerDetailsStep {...stepProps} />
            <WinDetailsStep {...stepProps} />
            <SupportProvidedStep {...stepProps} />
            <CheckBeforeSendingStep {...stepProps} />
          </>
        </Form>
      </FormLayout>
    </DefaultLayout>
  )
}

export default connect(state2props)(AddExportWinForm)
