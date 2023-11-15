import React from 'react'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step } from '../../../components'
import { steps } from './constants'

const OfficerDetailsStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.OFFICER_DETAILS}>
      <h1>Officer details</h1>
    </Step>
  )
}

export default OfficerDetailsStep
