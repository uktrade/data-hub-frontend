import React from 'react'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step } from '../../../components'
import { steps } from './constants'

const CheckBeforeSendingStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.CHECK_BEFORE_SENDING}>
      <h1>Check before sending</h1>
    </Step>
  )
}

export default CheckBeforeSendingStep
