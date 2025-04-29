import { React, useState } from 'react'

import styled from 'styled-components'

import { Label } from 'govuk-react'

import { FONT_WEIGHTS } from '@govuk-react/constants'

import { FOOTER_TEXT, FOOTER_BORDER_TOP } from '../../../client/utils/colours'

import Form from '../Form'
import Step1 from './step1'
import Step2 from './step2'

const StyledHcsat = styled('div')({
  clear: 'both',
  borderTop: `1px solid ${FOOTER_BORDER_TOP}`,
  color: `${FOOTER_TEXT}`,
  maxWidth: '960px',
  margin: '0px auto',
  paddingTop: '15px',
  paddingBottom: '15px',
})

const StyledLabel = styled(Label)({
  fontWeight: FONT_WEIGHTS.bold,
})

export default function Hcsat() {
  const [step, setStep] = useState(true)
  const [formStage, setFormCompletion] = useState(false)

  const handleUserNo = () => {
    setStep(false)
  }
  const handleUserYes = () => {
    setFormCompletion(true)
  }
  const handleUserAdditionalFeedback = () => {
    setFormCompletion(true)
  }
  //   const handleStepYesCompletion = () => {
  //     setYesCompletion(true)
  //   }
  return (
    <StyledHcsat>
      {/* <Form
        id={}
        analyticsFormName={}
        submissionTaskName=""
        redirectMode="soft"
        showStepInUrl={true}
        redirectTo={(_, {  }) =>
          `../thankyou?agree=${}`
        }
        transformPayload={transformPayload(token)}
      >

      </Form> */}
      {!formStage ? (
        step ? (
          <Form
            id="yes-no-feedback"
            analyticsFormName="yes-no-feedback"
            showStepInUrl={false}
            cancelRedirectTo={true}
          >
            <Step1 handleUserNo={handleUserNo} handleUserYes={handleUserYes} />
          </Form>
        ) : (
          <Form
            id="additional-feedback"
            analyticsFormName="additional-feedback"
            showStepInUrl={false}
            cancelRedirectTo={true}
          >
            <Step2 setFormCompletion={handleUserAdditionalFeedback} />
          </Form>
        )
      ) : (
        <StyledLabel>Thank you for your feedback.</StyledLabel>
      )}
    </StyledHcsat>
  )
}
