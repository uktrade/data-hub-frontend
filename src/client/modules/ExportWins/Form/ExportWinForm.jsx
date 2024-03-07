import React from 'react'
import { connect } from 'react-redux'

import { state2props, TASK_GET_EXPORT_WINS_SAVE_FORM } from './state'
import { DefaultLayout, Form, FormLayout } from '../../../components'
import { CompanyResource } from '../../../components/Resource'
import { transformFormValuesForAPI } from './transformers'
import urls from '../../../../lib/urls'

import CheckBeforeSendingStep from './CheckBeforeSendingStep'
import CreditForThisWinStep from './CreditForThisWinStep'
import CustomerDetailsStep from './CustomerDetailsStep'
import SupportProvidedStep from './SupportProvidedStep'
import OfficerDetailsStep from './OfficerDetailsStep'
import WinDetailsStep from './WinDetailsStep'

const CompanyName = ({ companyId }) => (
  <CompanyResource.Inline id={companyId}>
    {(company) => company.name.toUpperCase()}
  </CompanyResource.Inline>
)

const ExportWinForm = ({
  title,
  exportId,
  companyId,
  exportWinId,
  initialValuesTaskName,
  initialValuesPayload,
  csrfToken,
  currentAdviserId,
}) => {
  const stepProps = {
    isEditing: !!exportWinId,
    exportId,
    companyId,
    exportWinId,
  }
  return (
    <DefaultLayout
      heading={title}
      pageTitle={title}
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
        { text: title },
      ]}
    >
      <FormLayout>
        <Form
          id="export-win-form"
          showStepInUrl={true}
          cancelRedirectTo={() => urls.companies.exportWins.sent()}
          redirectTo={() => urls.companies.exportWins.sent()}
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
