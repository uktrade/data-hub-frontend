import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'govuk-react'
import styled from 'styled-components'
import { FONT_SIZE } from '@govuk-react/constants'
import pluralize from 'pluralize'

import { state2props, TASK_GET_EXPORT_WINS_SAVE_FORM } from './state'
import { steps, EMAIL } from './constants'
import CheckBeforeSendingStep from './CheckBeforeSendingStep'
import { transformFormValuesForAPI } from './transformers'
import CreditForThisWinStep from './CreditForThisWinStep'
import CustomerDetailsStep from './CustomerDetailsStep'
import SupportProvidedStep from './SupportProvidedStep'
import OfficerDetailsStep from './OfficerDetailsStep'
import WinDetailsStep from './WinDetailsStep'
import urls from '../../../../lib/urls'
import {
  Form,
  FormLayout,
  DefaultLayout,
  StatusMessage,
} from '../../../components'

const StyledStatusMessage = styled(StatusMessage)({
  fontSize: FONT_SIZE.SIZE_20,
  fontWeight: 700,
  marginTop: 25,
  marginBottom: 5,
})

const StyledParagraph = styled('p')({
  fontWeight: 'bold',
})

export const ContactLink = ({ sections }) => (
  <>
    Contact <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link> if you need to update
    the {pluralize('section', sections.length)}: {sections.join(', ')}
  </>
)

const ExportWinForm = ({
  heading,
  subheading,
  exportId,
  isEditing,
  companyId,
  exportWinId,
  breadcrumbs,
  currentStepName,
  excludedStepFields,
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
      localHeaderChildren={
        isEditing ? (
          currentStepName === steps.CHECK_BEFORE_SENDING ? (
            <StyledStatusMessage>
              <StyledParagraph>To edit an export win</StyledParagraph>
              <StyledParagraph>
                Edit each section that needs changing then return to the summary
                page. When you are happy with all the changes save the page.
              </StyledParagraph>
            </StyledStatusMessage>
          ) : excludedStepFields ? (
            <StyledStatusMessage>
              <ContactLink sections={excludedStepFields} />
            </StyledStatusMessage>
          ) : null
        ) : null
      }
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
