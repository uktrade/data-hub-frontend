import React from 'react'
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link } from 'govuk-react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import pluralize from 'pluralize'
import { FONT_SIZE } from '@govuk-react/constants'

import FlashMessages from '../../../components/LocalHeader/FlashMessages'
import { steps, EMAIL, STEP_TO_EXCLUDED_FIELDS_MAP } from './constants'
import { ExportWinsLink, VerticalSpacerWithMarginBottom } from '../Shared'
import { transformFormValuesForAPI } from './transformers'
import CreditForThisWinStep from './CreditForThisWinStep'
import { TASK_GET_EXPORT_WINS_SAVE_FORM } from './state'
import CustomerDetailsStep from './CustomerDetailsStep'
import SupportProvidedStep from './SupportProvidedStep'
import OfficerDetailsStep from './OfficerDetailsStep'
import { ResendExportWin } from './ResendExportWin'
import { WIN_STATUS } from '../Status/constants'
import WinDetailsStep from './WinDetailsStep'
import { ExportWinSuccess } from './Success'
import State from '../../../components/State'
import urls from '../../../../lib/urls'
import SummaryStep from './SummaryStep'
import {
  Form,
  FormLayout,
  DefaultLayout,
  StatusMessage,
} from '../../../components'

const FORM_ID = 'export-win-form'

const StyledStatusMessage = styled(StatusMessage)({
  fontSize: FONT_SIZE.SIZE_20,
  fontWeight: 700,
  marginTop: 25,
  marginBottom: 5,
})

const StyledParagraph = styled('p')({
  fontWeight: 'bold',
})

export const ContactLink = ({ sections = [], shouldPluralize = true }) => {
  const section = shouldPluralize
    ? `${pluralize('section', sections.length)}:`
    : 'section.'
  return (
    <>
      Contact <Link href={`mailto:${EMAIL}`}>{EMAIL}</Link> if you need to
      update the {section} {sections.join(', ')}
    </>
  )
}

const ResentExportWinContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 15,
})

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
}) => {
  const stepProps = {
    isEditing,
    exportId,
    companyId,
    exportWinId,
  }
  return (
    <State>
      {(state) => {
        const exportWinForm = state.Form[FORM_ID]
        const formValues = exportWinForm?.values
        const currentStepName = exportWinForm?.currentStepName
        const excludedStepFields = STEP_TO_EXCLUDED_FIELDS_MAP[currentStepName]
        const winStatus = formValues?.customer_response?.agree_with_win
        const showSuccessfullySent = state.ResendExportWin[exportWinId]?.success
        return (
          <>
            <DefaultLayout
              pageTitle={heading}
              heading={heading}
              subheading={subheading}
              breadcrumbs={breadcrumbs}
              localHeaderChildren={
                isEditing ? (
                  currentStepName === steps.SUMMARY ? (
                    <>
                      {showSuccessfullySent && (
                        <FlashMessages
                          flashMessages={{
                            success: [<ExportWinSuccess winId={exportWinId} />],
                          }}
                        />
                      )}
                      <StyledStatusMessage>
                        <StyledParagraph>To edit an export win</StyledParagraph>
                        <StyledParagraph>
                          Edit each section that needs changing then return to
                          the summary page. When you are happy with all the
                          changes save the page.
                        </StyledParagraph>
                      </StyledStatusMessage>
                      {winStatus === WIN_STATUS.PENDING && (
                        <ResentExportWinContainer>
                          <ResendExportWin id={exportWinId} />
                        </ResentExportWinContainer>
                      )}
                    </>
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
                  id={FORM_ID}
                  showStepInUrl={true}
                  cancelRedirectTo={() => urls.companies.exportWins.pending()}
                  redirectTo={(result) =>
                    isEditing
                      ? urls.companies.exportWins.editSuccess(
                          companyId,
                          exportWinId
                        )
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
                      _csrf: state.csrfToken,
                      adviser: state.currentAdviserId,
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
                    <SummaryStep {...stepProps} />
                  </>
                </Form>
                {currentStepName === steps.SUMMARY && (
                  <VerticalSpacerWithMarginBottom>
                    {winStatus !== WIN_STATUS.PENDING && (
                      <Link
                        as={ReactRouterLink}
                        data-test="customer-feedback"
                        to={urls.companies.exportWins.customerFeedback(
                          companyId,
                          exportWinId
                        )}
                      >
                        Customer feedback
                      </Link>
                    )}
                    <ExportWinsLink />
                  </VerticalSpacerWithMarginBottom>
                )}
              </FormLayout>
            </DefaultLayout>
          </>
        )
      }}
    </State>
  )
}

export default connect((state) => state)(ExportWinForm)
