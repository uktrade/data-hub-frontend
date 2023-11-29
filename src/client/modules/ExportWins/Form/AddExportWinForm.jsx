import React from 'react'
import { useLocation } from 'react-router-dom'
import LoadingBox from '@govuk-react/loading-box'
import { SPACING } from '@govuk-react/constants'
import styled from 'styled-components'

import { getQueryParamsFromLocation } from '../../../../client/utils/url'
import { DefaultLayout, Form, FormLayout } from '../../../components'
import { CompanyResource } from '../../../components/Resource'
import { TASK_GET_EXPORT_WINS_SAVE_FORM } from './state'
import OfficerDetailsStep from './OfficerDetailsStep'
import CreditForThisWinStep from './CreditForThisWinStep'
import CustomerDetailsStep from './CustomerDetailsStep'
import WinDetailsStep from './WinDetailsStep'
import SupportProvidedStep from './SupportProvidedStep'
import CheckBeforeSendingStep from './CheckBeforeSending'
import urls from '../../../../lib/urls'

const StyledLoadingBox = styled(LoadingBox)({
  height: 16,
  width: SPACING.SCALE_5,
})

const AddExportWinForm = () => {
  const location = useLocation()
  const queryParams = getQueryParamsFromLocation(location)

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
        >
          {({ values }) => {
            return (
              <>
                <OfficerDetailsStep />
                <CreditForThisWinStep />
                <CustomerDetailsStep />
                <WinDetailsStep />
                <SupportProvidedStep />
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

export default AddExportWinForm
