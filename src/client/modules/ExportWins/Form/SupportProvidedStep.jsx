import React from 'react'

import { useFormContext } from '../../../../client/components/Form/hooks'
import { Step } from '../../../components'
import { steps } from './constants'

const SupportProvidedStep = () => {
  // eslint-disable-next-line no-unused-vars
  const { values } = useFormContext()
  return (
    <Step name={steps.SUPPORT_PROVIDED}>
      <h1>Support provided</h1>
    </Step>
  )
}

export default SupportProvidedStep
