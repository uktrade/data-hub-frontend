import React from 'react'
import { connect } from 'react-redux'

import { state2props, TASK_GET_EXPORT_WINS_SAVE_FORM } from './state'
import { DefaultLayout, Form, FormLayout } from '../../../components'
import { transformFormValuesForAPI } from './transformers'
import urls from '../../../../lib/urls'

import CheckBeforeSendingStep from './CheckBeforeSendingStep'
import CreditForThisWinStep from './CreditForThisWinStep'
import CustomerDetailsStep from './CustomerDetailsStep'
import SupportProvidedStep from './SupportProvidedStep'
import OfficerDetailsStep from './OfficerDetailsStep'
import WinDetailsStep from './WinDetailsStep'

const ExportWinForm = ({
  heading,
  subheading,
  exportId,
  isEditing,
  companyId,
  exportWinId,
  breadcrumbs,
  initialValuesTaskName,
  initialValuesPayload,
  csrfToken,
  currentAdviserId,
}) => {
  const stepProps = {
    isEditing,
    exportId,
    companyId,
    exportWinId,
  }
  return (
    <DefaultLayout
      pageTitle={heading}
      heading={heading}
      subheading={subheading}
      breadcrumbs={breadcrumbs}
    >
      <FormLayout>
        <Form
          id="export-win-form"
          showStepInUrl={true}
          cancelRedirectTo={() => urls.companies.exportWins.sent()}
          redirectTo={(result) =>
            isEditing
              ? urls.companies.exportWins.editSuccess(companyId, exportWinId)
              : urls.companies.exportWins.createSuccess(result.data.id)
          }
          analyticsFormName="exportWinForm"
          submissionTaskName={TASK_GET_EXPORT_WINS_SAVE_FORM}
          initialValuesTaskName={initialValuesTaskName}
          transformPayload={(values) => ({
            exportWinId,
            payload: {
              ...transformFormValuesForAPI(values),
              company: companyId,
              _csrf: csrfToken,
              adviser: currentAdviserId,
            },
          })}
          initialValuesPayload={initialValuesPayload}
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

export default connect(state2props)(ExportWinForm)
