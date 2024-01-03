import React from 'react'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step } from '../../../components'
import { steps } from './constants'

const CreditForThisWinStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.CREDIT_FOR_THIS_WIN}>
      <h1>Credit for this win</h1>
    </Step>
  )
}

export default CreditForThisWinStep
