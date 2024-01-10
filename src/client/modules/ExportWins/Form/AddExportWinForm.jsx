import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import LoadingBox from '@govuk-react/loading-box'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { DefaultLayout, Form, FormLayout } from '../../../components'
import { CompanyResource } from '../../../components/Resource'
import { transformFormValuesForAPI } from './transformers'
import urls from '../../../../lib/urls'
import {
  state2props,
  TASK_GET_EXPORT_PROJECT,
  TASK_GET_EXPORT_WINS_SAVE_FORM,
} from './state'
import OfficerDetailsStep from './OfficerDetailsStep'
import CreditForThisWinStep from './CreditForThisWinStep'
import CustomerDetailsStep from './CustomerDetailsStep'
import WinDetailsStep from './WinDetailsStep'
import SupportGivenStep from './SupportGivenStep'
import CheckBeforeSendingStep from './CheckBeforeSending'

const StyledLoadingBox = styled(LoadingBox)({
  height: 16,
  width: SPACING.SCALE_5,
})

const AddExportWinForm = ({ csrfToken, currentAdviserId }) => {
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)
  const company = queryParams.company

  return (
    <DefaultLayout
      heading="Add export win"
      subheading={
        <CompanyResource
          taskStatusProps={{
            renderProgress: () => (
              <StyledLoadingBox backgroundColorOpacity={0} loading={true} />
            ),
          }}
          id={queryParams.company}
        >
          {(company) => company.name.toUpperCase()}
        </CompanyResource>
      }
      pageTitle="Add export win"
      breadcrumbs={[]}
    >
      <FormLayout>
        <Form
          id="add-export-win"
          showStepInUrl={true}
          cancelRedirectTo={() => urls.companies.exportWins.unconfirmed()}
          redirectTo={() => urls.companies.exportWins.unconfirmed()}
          analyticsFormName="addExportWin"
          submissionTaskName={TASK_GET_EXPORT_WINS_SAVE_FORM}
          initialValuesTaskName={TASK_GET_EXPORT_PROJECT}
          transformPayload={(values) => ({
            exportWinId: queryParams.exportwin,
            payload: {
              ...transformFormValuesForAPI(values),
              company,
              _csrf: csrfToken,
              adviser: currentAdviserId,
            },
          })}
          initialValuesPayload={{
            id: queryParams.export,
          }}
        >
          {({ values }) => {
            return (
              <>
                <OfficerDetailsStep />
                <CreditForThisWinStep />
                <CustomerDetailsStep />
                <WinDetailsStep />
                <SupportGivenStep />
                <CheckBeforeSendingStep />
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </>
            )
          }}
        </Form>
      </FormLayout>
    </DefaultLayout>
  )
}

export default connect(state2props)(AddExportWinForm)
