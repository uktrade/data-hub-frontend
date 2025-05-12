import React, { useState } from 'react'

import styled from 'styled-components'

import { Paragraph } from 'govuk-react'

import { FONT_WEIGHTS } from '@govuk-react/constants'

import { FOOTER_TEXT, FOOTER_BORDER_TOP } from '../../../client/utils/colours'

import Step1 from './step1'
import Step2 from './step2'
import { apiProxyAxios } from '../Task/utils'

const StyledHcsat = styled('aside')({
  borderTop: `1px solid ${FOOTER_BORDER_TOP}`,
  color: `${FOOTER_TEXT}`,
  minHeight: '40px',
  padding: '20px 0',
})

const StyledParagraph = styled(Paragraph)({
  marginBottom: '0px',
  height: '37px',
  fontSize: '16px',
  display: 'flex',
  p: {
    fontWeight: FONT_WEIGHTS.bold,
    alignSelf: 'center',
  },
})

export default function Hcsat() {
  const [showAdditionalFeedback, setShowAdditionalFeedback] = useState(false)
  const [formComplete, setFormComplete] = useState(false)
  const [submittedFeedbackId, setSubmittedFeedbackId] = useState()

  const submitInitialFeedback = async (postData) => {
    postData.url = window.location.href
    return await apiProxyAxios.post('/v4/hcsat', postData).then(({ data }) => {
      setSubmittedFeedbackId(data.id)
    })
  }

  const submitAdditionalFeedback = async (postData) => {
    return await apiProxyAxios.patch(
      `/v4/hcsat/${submittedFeedbackId}`,
      postData
    )
  }

  const handleUserNo = () => {
    submitInitialFeedback({ was_useful: false })
    setShowAdditionalFeedback(true)
  }

  const handleUserYes = () => {
    submitInitialFeedback({ was_useful: true })
    setFormComplete(true)
  }

  const handleUserAdditionalFeedback = (data) => {
    submitAdditionalFeedback(data)
    setFormComplete(true)
  }

  return (
    <StyledHcsat data-test="hcsat" aria-label="Is this page useful?">
      {!formComplete ? (
        !showAdditionalFeedback && !submittedFeedbackId ? (
          <Step1 handleUserNo={handleUserNo} handleUserYes={handleUserYes} />
        ) : (
          <Step2 onFormSubmit={handleUserAdditionalFeedback} />
        )
      ) : (
        <StyledParagraph>Thank you for your feedback.</StyledParagraph>
      )}
    </StyledHcsat>
  )
}
