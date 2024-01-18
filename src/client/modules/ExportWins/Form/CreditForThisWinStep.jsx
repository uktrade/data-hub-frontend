import React from 'react'
import styled from 'styled-components'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step, FieldInput } from '../../../components'
import { steps } from './constants'

const StyledFieldInput = styled(FieldInput)({
  display: 'none',
})

const CreditForThisWinStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.CREDIT_FOR_THIS_WIN}>
      <h1>Credit for this win</h1>
      <StyledFieldInput name="hidden" type="text" />
    </Step>
  )
}

export default CreditForThisWinStep
