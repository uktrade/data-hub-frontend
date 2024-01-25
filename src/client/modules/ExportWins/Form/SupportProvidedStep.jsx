import React from 'react'
import styled from 'styled-components'

import { useFormContext } from '../../../components/Form/hooks'
import { Step, FieldInput } from '../../../components'
import { steps } from './constants'

const StyledFieldInput = styled(FieldInput)({
  display: 'none',
})

const SupportProvidedStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.SUPPORT_PROVIDED}>
      <h1>Support provided</h1>
      <StyledFieldInput name="hidden" type="text" />
    </Step>
  )
}

export default SupportProvidedStep
