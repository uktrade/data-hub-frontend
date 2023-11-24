import React from 'react'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step, FieldInput } from '../../../components'
import { steps } from './constants'

const CheckBeforeSendingStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.CHECK_BEFORE_SENDING}>
      <h1>Check before sending</h1>
      <FieldInput name="test4" label="Test4" type="text" />
    </Step>
  )
}

export default CheckBeforeSendingStep
