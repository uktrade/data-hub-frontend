import React from 'react'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step } from '../../../components'
import { steps } from './constants'

const WinDetailsStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.WIN_DETAILS}>
      <h1>Win details</h1>
    </Step>
  )
}

export default WinDetailsStep
