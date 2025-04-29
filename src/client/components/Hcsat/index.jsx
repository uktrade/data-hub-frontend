import React, { useState } from 'react'

import styled from 'styled-components'

import { Label } from 'govuk-react'

import { FONT_WEIGHTS, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { FOOTER_TEXT, FOOTER_BORDER_TOP } from '../../../client/utils/colours'

import Form from '../Form'
import Step1 from './step1'
import Step2 from './step2'
import { HCSAT_SUBMIT_FEEDBACK } from './state'

const StyledHcsat = styled('div')({
  borderTop: `1px solid ${FOOTER_BORDER_TOP}`,
  color: `${FOOTER_TEXT}`,
  maxWidth: '960px',
  padding: '20px 0',
  marginLeft: SPACING.SCALE_3,
  marginRight: SPACING.SCALE_3,
  [MEDIA_QUERIES.LARGESCREEN]: {
    marginLeft: SPACING.SCALE_5,
    marginRight: SPACING.SCALE_5,
  },
  '@media only screen and (min-width:1020px)': {
    margin: '0 auto',
  },
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
            id="foo"
            submissionTaskName={HCSAT_SUBMIT_FEEDBACK}
            initialValuesTaskName="load something"
            analyticsFormName="Update something"
          >
            <Step1 handleUserNo={handleUserNo} handleUserYes={handleUserYes} />
          </Form>
        ) : (
          <Step2 setFormCompletion={handleUserAdditionalFeedback} />
        )
      ) : (
        <StyledLabel>Thank you for your feedback.</StyledLabel>
      )}
    </StyledHcsat>
  )
}
