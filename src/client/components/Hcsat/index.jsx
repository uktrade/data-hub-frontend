import React, { useState } from 'react'

import styled from 'styled-components'

import { Label } from 'govuk-react'

import { FONT_WEIGHTS, MEDIA_QUERIES, SPACING } from '@govuk-react/constants'

import { FOOTER_TEXT, FOOTER_BORDER_TOP } from '../../../client/utils/colours'

import Step1 from './step1'
import Step2 from './step2'
import { apiProxyAxios } from '../Task/utils'

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
  const [showAdditionalFeedback, setshowAdditionalFeedback] = useState(false)
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
    setshowAdditionalFeedback(true)
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
    <StyledHcsat>
      {!formComplete ? (
        !showAdditionalFeedback && !submittedFeedbackId ? (
          <Step1 handleUserNo={handleUserNo} handleUserYes={handleUserYes} />
        ) : (
          <Step2 onFormSubmit={handleUserAdditionalFeedback} />
        )
      ) : (
        <StyledLabel>Thank you for your feedback.</StyledLabel>
      )}
    </StyledHcsat>
  )
}
